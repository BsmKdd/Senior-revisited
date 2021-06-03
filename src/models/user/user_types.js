const mongoose = require('mongoose')
const User = require('./user')


const adminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

// Member schema
const memberSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        default: false,
    },
    expireDate: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

// Coach schema
const coachSchema = new mongoose.Schema({
    salary: {
        type: Number,
        required: true
    },
    expertises: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

})

//Bartender schema
const bartenderSchema = new mongoose.Schema({
    salary: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

// Delete the parent account if child is deleted
adminSchema.pre('remove', async function (next) {
    const admin = this

    await User.deleteOne({ admin: admin._id })

    next()
})

memberSchema.pre('remove', async function (next) {
    const member = this

    await User.deleteOne({ member: member._id })

    next()
})

coachSchema.pre('remove', async function (next) {
    const coach = this

    await User.deleteOne({ coach: coach._id })

    next()
})

bartenderSchema.pre('remove', async function (next) {
    const bartender = this

    await User.deleteOne({ bartender: bartender._id })

    next()
})

// Connecting with the workouts
memberSchema.virtual('.././workout/workout_types', { ref: 'assignedWorkout', localField: '_id', foreignField: 'member'})
coachSchema.virtual('.././workout/workout_types', { ref: 'assignedWorkout', localField: '_id', foreignField: 'coach'})
memberSchema.virtual('.././workout/workout_types', { ref: 'currentWorkout', localField: '_id', foreignField: 'member'})
memberSchema.virtual('.././workout/workout_types', { ref: 'previousWorkout', localField: '_id', foreignField: 'member'})

const Admin = mongoose.model('Admin', adminSchema)
const Member = mongoose.model('Member', memberSchema)
const Coach = mongoose.model('Coach', coachSchema)
const Bartender = mongoose.model('Bartender', bartenderSchema)

module.exports = {
    Admin,
    Member,
    Coach,
    Bartender
}