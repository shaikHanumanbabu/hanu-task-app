const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bcryptjs = require('bcryptjs')
const { ObjectId } = require('mongoose')
const app = express()

// app.use((req, res, next) => {
//      res.status(503).send({messsage : "Under Maintaince"})
//     // next()
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const port = process.env.PORT


const multer = require('multer')
const upload = multer({
    dest : 'images'
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})
app.listen(port, () => {
    console.log('Server is running at '+ port);
})

// const checkPassword = async () => {
//     const pass = "Hanuman@12";
//     const hashedPass = await bcryptjs.hash(pass, 8)
//     console.log('hashed password', hashedPass);

//     const isMatched = await bcryptjs.compare("check", hashedPass)
//     console.log(isMatched);
// }

// checkPassword()

//  JSON WEB TOKEN START HERE


const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({_id : "12345", name : "Hanuman", last_name : "shaik"}, "secrete")
    console.log(token);
}

// const Task = require('./models/task')
const main = async () => {
    // const task = await Task.findById('61b4d9bcb55bc27d0caabbfc')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner);

    //  getting tasks
    // const user = await User.findById('61b4d8adca7eae7b79469258')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks);
}
// main()
// myFunction()