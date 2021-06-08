const mongoose = require('mongoose')
const Workout = require('./workout')

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
    workoutName: String,
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

assignedWorkoutSchema.virtual('workout_', { ref: 'Workout', localField: 'workout', foreignField: '_id'})
currentWorkoutSchema.virtual('workout_', { ref: 'Workout', localField: 'workout', foreignField: '_id'})
premadeWorkoutSchema.virtual('workout_', { ref: 'Workout', localField: 'workout', foreignField: '_id'})
previousWorkoutSchema.virtual('workout_', { ref: 'Workout', localField: 'workout', foreignField: '_id'})

premadeWorkoutSchema.pre('deleteOne', async function (next) {
    await Workout.deleteOne({ _id: this._conditions.workout })
    next()
})

const AssignedWorkout = mongoose.model('AssignedWorkout', assignedWorkoutSchema)
const CurrentWorkout = mongoose.model('CurrentWorkout', currentWorkoutSchema)
const PremadeWorkout = mongoose.model('PremadeWorkout', premadeWorkoutSchema)
const PreviousWorkout = mongoose.model('PreviousWorkout', previousWorkoutSchema)

module.exports = {
    AssignedWorkout,
    CurrentWorkout,
    PremadeWorkout,
    PreviousWorkout
}
