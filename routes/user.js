const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Audit = require('../models/audit')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

//Delete User
router.delete('/:deleteUserId', auth, async(req, res) => {
    try{
     
        let deleteUser =  await User.deleteOne({_id : ObjectId(req.params.deleteUserId)}, (err, result) => {
            if(err){
                res.status(201).json({
                    success : false,
                    message : 'User not found'
                })
                return
            }
            //console.log(result)
            res.status(201).json({
                success : true,
                message : 'User deleted succesfully'
            })
            return

        })
    }catch(error){
        console.log(err)
        res.status(400).send({
            success: false,
            message: "User not authorized"
        })
    }
})


//Edit users
router.put('/edit_user', auth, async(req, res) => {
    console.log('anshul')
    try{
        const {
          updateUserId,
          firstName,
          lastName,
          phoneNumber,
          email
        } = req.body
        console.log(req.body, 'bodyy')
        const updateUser = await User.findOne({_id : ObjectId(updateUserId)});
        if (!updateUser) {
            res.status(201).send({
                success: false,
                message: 'Update user Id Not found'
            })
            return
        }
        if (firstName) {
            updateUser.firstName = firstName
        }
        if (lastName) {
            updateUser.lastName = lastName
        }
        if (phoneNumber) {
            updateUser.phoneNumber = phoneNumber
        }
        if (email) {
            updateUser.email = email
        }

        await updateUser.save()
        res.status(201).send({
            success: true
        })

    }catch(err){
        console.log(err, 'err')
        console.log('anshul')
        res.status(400).send({
            success: false,
            message: "User not authorized"
        })
    }
})


//Get All Users

router.get('/users', auth,  async (req, res) => {
    try{
        const user =await User.find({}).sort({_id:-1});
        res.status(201).json({
            success : true,
            users : user
        })
    }catch(error){
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Invalid registered user"
        })
    }
})

// Login Api
router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
      //  console.log(user)
        
        await user.save()
        const audit = new Audit({
            loginTime : Date.now(),
            userId : user._id,
            name : user.firstName + " " + user.lastName
        })
        await audit.save()
        res.status(201).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Invalid Credentials"
        })

    }
})


// Create a user
router.post('/register', async (req, res) => {
    try {
        // console.log('anshusfdadfsadfsalkjfdlal')
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            success: true,
            user,
            token
        })
    } catch (error) {
        console.log(error)
        const match = /E11000 duplicate key error index: (\w+)_/.exec(error.errmsg)
        var message = ''
        //console.log(match)
        if (match) {
            switch (match[1]) {
                case 'email':
                    message = 'Email is already registered!'
                    break
                default:
                    message = 'Email is already registered!'
            }
            res.status(201).send({
                success: false,
                message: message
            })
        } else {
            res.status(400).send({
                success: false,
                message: error.errmsg
            })
        }
    }
})

// Logout request
router.post('/logout', auth, async (req, res) => {
    try {
        // console.log(req.token)
        const index = req.user.tokens.findIndex(t => t.token == req.token)
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()
        res.status(201).send({
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


module.exports = router