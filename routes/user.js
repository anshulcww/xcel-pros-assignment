const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Slots = require('../models/slots')
const Booking = require('../models/booking')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

// Get token for Anonymous
router.get('/verificationLink/:userId', async (req, res) => {
    console.log(req.params, typeof req.params.userId)
    try{

        const user = await User.findOne({
            _id : ObjectId(req.params.userId)        
        })
        console.log(user)
        const token = await user.generateAuthToken()
        res.status(201).json({
            success: true,
            user,
            token
        })

    }catch(err){
        console.log(err)
        res.status(400).send({
            success: false,
            message: "Something went wrong"
        })
    }
})

// Email registeration for Anonymous

router.post('/addAnonymous', async (req, res) => {
    try{
        const user = new User(req.body)
        user.isVerified = false
        await user.save()
        console.log(user)
        let userId = user._id
        let verificationLink = "http://localhost:5000/user/verificationLink/" + userId
        res.status(201).send({
            success : true,
            verificationLink : verificationLink
        })
    }catch(error){
        console.log(error)
        const match = /E11000 duplicate key error.+index: (\w+)_/.exec(error.errmsg)
        var message = ''
        if (match) {
            switch (match[1]) {
                case 'email':
                    message = 'Email is already registered!'
                    break
                default:
                    message = 'Invalid request!'
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


// Booking Available Slots

router.post('/bookingSlot', auth, async (req, res) => {
    try{
        const user = req.user
        const {
            slotId,
            userId,
            date,
            time
        } =   req.body

        let checkSlots =  await Slots.find({
            $and: [ { userId: userId }, { date: date }, { time: time }, {status : true}]
        })
        if(checkSlots.length > 0){
            let booking = new Booking({
                slotId : slotId,
                userId : userId,
                date: date,
                time : time,
                bookerId : user._id
            })
            console.log(booking)
            await booking.save()
            let setStatus = await Slots.updateOne({
               _id : ObjectId(slotId) 
            }, {$set : {status : false}})
            res.status(201).send({
                success : true,
                message : "Successfully booked"
            })
        }else{
            res.status(201).send({
                success :  true,
                message : "Slot not available"
            })
        }
    }catch(error){
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Something went wrong"
        })
    }
})


// Get All Slots for unregistered user
router.get('/availableSlots/:date',auth, async (req, res) => {
    try {
        let slots = await Slots.find({
            date: req.params.date,
            status : true
        })
        res.status(201).send({
            success: true,
            slots: slots
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Something went wrong"
        })
    }
})

// Add Availabile Slots for the registered user

router.post('/addSlots', auth, async (req, res) => {
    try {
        const user = req.user;
        if(user.isVerified){
            let userId = req.user._id
            let addedSlots = []
            let alreadyAdded = []
            const {
                slots
            } = req.body
            for(let i = 0; i< slots.length; i++){
                let checkSlot = await Slots.find({
                    $and: [{ userId: userId }, { date: slots[i].date }, { time: slots[i].time }]
                })
                if (checkSlot.length === 0) {
                    const slotData = new Slots({
                        userId: userId,
                        date: slots[i].date,
                        time: slots[i].time,
                        status: true
                    });
    
                    await slotData.save();
                    addedSlots.push(slotData)
                } else {
                    let data = {
                        "userId" : userId,
                        "date" : slots[i].date,
                        "time" : slots[i].time,
                        "status" : "Already added this slot"
                    }
                    alreadyAdded.push(data)
                }
            }
               res.status(201).json({
                        success: true,
                        addedSlots : addedSlots,
                        alreadyAdded : alreadyAdded
                    })
          
        }else{
            res.status(201).json({
                success: true,
                message: "Not Registered User"
            })
        }
     

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Something went wrong"
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
        console.log(user)
        await user.save()
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

module.exports = router