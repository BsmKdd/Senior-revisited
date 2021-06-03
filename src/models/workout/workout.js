const mongoose = require('mongoose')


const workoutSchema = new mongoose.Schema({
    moves:[{
        move: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'move'
        }
    }]
})

workoutSchema.virtual('workout_types', { ref: 'assignedWorkout', localField: '_id', foreignField: 'workout'})
workoutSchema.virtual('workout_types', { ref: 'currentWorkout', localField: '_id', foreignField: 'workout'})
workoutSchema.virtual('workout_types', { ref: 'premadeWorkout', localField: '_id', foreignField: 'workout'})
workoutSchema.virtual('workout_types', { ref: 'previousWorkout', localField: '_id', foreignField: 'workout'})

const Workout = mongoose.model('Workout', workoutSchema)

module.exports = Workout