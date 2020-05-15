const mongoose = require('mongoose')

const auditSchema = mongoose.Schema({
    loginTime: {
        type: String,
        required: true
    },
    userId : {
        type: String,
        required :  true
    },
    name : {
        type :  String,
        required : true
    }
})

const Audit = mongoose.model('audit', auditSchema)

module.exports = Audit