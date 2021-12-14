// const mongoose = require('mongoose')
// mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})


const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'errror'))

db.once('open', function() {
    console.log('connected');
})







