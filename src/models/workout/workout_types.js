const mongoose = require('mongoose')
const Workout = require('./workout')
const { Member, Coach, Bartender } = require('.././user/user_types')

const assignedWorkoutSchema = new mongoose.Schema({
    workout: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Workout'
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Coach'
    }
})

const currentWorkoutSchema = new mongoose.Schema({
    workout: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Workout'
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    }
})

const premadeWorkoutSchema = new mongoose.Schema({
    workout: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Workout'
    },
    pic: {
        type: Buffer
    }
})

const previousWorkoutSchema = new mongoose.Schema({
    workout: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Workout'
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    }
})

const assignedWorkout = mongoose.model('assignedWorkout', assignedWorkoutSchema)
const currentWorkout = mongoose.model('currentWorkout', currentWorkoutSchema)
const premadeWorkout = mongoose.model('premadeWorkout', premadeWorkoutSchema)
const previousWorkout = mongoose.model('previousWorkout', previousWorkoutSchema)

module.exports = {
    assignedWorkout,
    currentWorkout,
    premadeWorkout,
    previousWorkout
}
