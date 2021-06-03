const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Admin, Member, Coach, Bartender } = require('./user_types')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isStrongPassword(value, { minSymbols: 0})) {
                throw new Error('Password is weak.')
            }
        }
    },
    phone: {
        type: String,
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        postalCode: {
            type: String,
            trim: true,
        }
    },
    pic: {
        type: Buffer
    },
    userType: {
        type: String,
        required: true,
        default: 'Member',
        enum: ['Admin', 'Member', 'Coach', 'Bartender'],
        immutable: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// Connecting with the user types
userSchema.virtual('user_types', { ref: 'Member', localField: '_id', foreignField: 'user'})
userSchema.virtual('user_types', { ref: 'Coach', localField: '_id', foreignField: 'user'})
userSchema.virtual('user_types', { ref: 'Bartender', localField: '_id', foreignField: 'user'})

// Customizing built-in functionality, removing data we don't want returned.
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.pic

    return userObject
}

// Generating authentication tokens
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() } , process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this
    // if(user.isModified('userType')) {
    //     throw 'userType is read only!'
    // }

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Finding a user by email
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error('Invalid credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Invalid Credentials')
    }

    return user
}

// Delete user if parent is removed
userSchema.pre('remove', async function (next) {
    const user = this

    await Member.deleteOne({ user: user._id })
    await Coach.deleteOne({ user: user._id })
    await Bartender.deleteOne({ user: user._id })

    next()
})

const User = mongoose.model('user', userSchema)

module.exports = User

