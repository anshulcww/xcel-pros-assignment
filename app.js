const express = require('express')
const mongoose = require('mongoose')
const Config = require('./config')
const user = require('./routes/user')
const cors = require('cors')

const app = express()

app.use(express.json());
app.use(cors())

app.use('/user', user)


//Test Api
app.get('/', (req, res) => res.send('Server is running .... '))

//connecting Mongodb


mongoose.connect(Config.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, doc) => {
    if(err) {
        console.log(err)
    }else{
        console.log('database created')
        
    }
})

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`server running on port `)
})
