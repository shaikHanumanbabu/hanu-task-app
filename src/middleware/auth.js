const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req, res, next) => {
    // console.log('auth middleware is running');
    // next()
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRETE)
        const user = await User.findOne({_id : decoded._id, 'tokens.token': token})
        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        return res.status(401).send({message : 'Invalid request'})
    }
}

module.exports = auth