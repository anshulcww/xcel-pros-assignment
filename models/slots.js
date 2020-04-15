const mongoose = require('mongoose')

const slotSchema = mongoose.Schema({
    userId: {
        type : String,
    },
    date: {
        type : String,
    },
    time: {
        type : String,
    },
    status: {
        type : Boolean
    }
})


const Slots = mongoose.model('slots', slotSchema)
module.exports = Slots