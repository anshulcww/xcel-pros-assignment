const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    slotId : {
        type: String
    },
    userId: {
        type : String,
    },
    date: {
        type : String,
    },
    time: {
        type : String,
    },
})

const Booking = mongoose.model('booking', bookingSchema)
module.exports = Booking