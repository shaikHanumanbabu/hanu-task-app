const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const {sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const upload = multer({
    limits : {
        fileSize : 1000000,

    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a image'))

        }
        cb(undefined, true)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
        // res.status(201).send(user)

    } catch (error) {
        res.status(400).send(error)
        
    }
})

router.post('/users/login', async (req, res) => {
    debugger
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
        // console.log('in router', user);

        return res.send(user)
    } catch (error) {
        console.log('eroor ---- ',error);
        res.send(error)
        
    }
})

//  GET USERS FROM MONGOOSE


router.get('/users/me',auth ,async (req, res) => {
    return res.status(200).send(req.user)
    
})

router.post('/users/me/avatar' , auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    return res.send()
    
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar' , auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    return res.status(200).send()
    
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/me', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        
    }
})

router.post('/users/logout',auth ,async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
    
})

router.post('/users/logoutall',auth ,async (req, res) => {
    try {
        req.user.tokens = []
        req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
    
})


//  GET USER FROM MONGOOSE


// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send(error)
        
//     }
    
// })
router.patch('/users/me', auth,  async (req, res) => {
    const _id = req.user._id;

    const updates = Object.keys(req.body)
    try {
        const user = await User.findById(_id);
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true})
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        console.log(error);
       return res.status(500).send(error)
        
    }
})

// DELETE USER

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
       return res.status(500).send(error)
        
    }
})


module.exports = router