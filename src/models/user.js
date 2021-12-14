
const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        index: true,
        validate(value) {
            if(!validator.isEmail(value)) {

                throw new Error('Invalid Email')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        validate(value) {
            if(value.length < 6) {
                throw new Error('Password Must Be 6 Length')
            }
            if (value == "password") {
                throw new Error('Password Doesnot Contain Password Word')
            }
        }
    },
    age : {
        type:Number,
        default : 0
    },
    tokens : [ {
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
}, {
    timestamps : true
})

userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'

})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token =  await jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRETE)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    console.log('laallalalla');
    const user = await User.findOne({email})
    console.log(user, 'user ---------------------');
    if(!user) {
        throw new Error('unable to login')
    }
    const isMatched = await bcryptjs.compare(password, user.password)
    if(!isMatched) {
        throw new Error('unable to login')
    }
    return user
}

// hash the password before saving
userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8)
    }
    console.log('before save');
    next()
})
// DELETE THE TASKS WHEN USER DELETED
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner : user._id})
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User