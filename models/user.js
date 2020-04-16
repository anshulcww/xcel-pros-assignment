const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Config = require('../config')

const userSchema = mongoose.Schema({
    name: {
        type : String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({
                    error: 'invalid email address'
                })
            }
        }
    },
    password: {
        type: String,
        // required: true
    },
    tokens: [{
        token: String
    }],
    isVerified:{
        type: Boolean,
        default : true
    }
})

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id
    }, Config.JWT_KEY)
    user.tokens = user.tokens.concat({
        token
    })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new Error('invalid credentials')
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        throw new Error('invalid credentials')
    }
    return user
}


const User = mongoose.model('user', userSchema)
module.exports = User