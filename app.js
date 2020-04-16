const express = require('express')
const mongoose = require('mongoose')
const Config = require('./config')
const user = require('./routes/user')

const app = express()

app.use(express.json());

app.use('/user', user)


//Test Api
app.get('/', (req, res) => res.send('Server is running .... '))

//connecting Mongodb


mongoose.connect(Config.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, () => console.log("MongoDB connected to", Config.MONGODB_URL))

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`server running on port `)
})
