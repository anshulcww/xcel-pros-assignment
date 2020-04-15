const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Slots = require('../models/slots')
const Booking = require('../models/booking')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// Booking Available Slots

router.post('/bookingSlot', async (req, res) => {
    try{
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
                time : time
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
router.get('/availableSlots/:date', async (req, res) => {
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
        let userId = req.user._id
        const {
            date,
            time
        } = req.body
        let checkSlot = await Slots.find({
            $and: [{ userId: userId }, { date: date }, { time: time }]
        })
        console.log(checkSlot)
        if (checkSlot.length === 0) {
            const slots = new Slots({
                userId: userId,
                date: req.body.date,
                time: req.body.time,
                status: true
            });
            await slots.save();
            res.status(201).json({
                success: true,
                slots
            })
        } else {
            res.status(201).json({
                success: true,
                message: "Already added this slot"
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

module.exports = router