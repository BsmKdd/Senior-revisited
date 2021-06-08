const mongoose = require('mongoose')

const moveSchema = new mongoose.Schema({
    move: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Move'
    }, 
    reps: Number
})

const workoutSchema = new mongoose.Schema({
    workoutType:{
        type: String,
        enum: ['Assigned', 'Current', 'Premade', 'Previous']
    },
    moves:[moveSchema]
})

// workoutSchema.virtual('workout_types', { ref: 'assignedWorkout', localField: '_id', foreignField: 'workout'})
// workoutSchema.virtual('workout_types', { ref: 'currentWorkout', localField: '_id', foreignField: 'workout'})
// workoutSchema.virtual('workout_types', { ref: 'premadeWorkout', localField: '_id', foreignField: 'workout'})
// workoutSchema.virtual('workout_types', { ref: 'previousWorkout', localField: '_id', foreignField: 'workout'})

moveSchema.virtual('move_', {
    ref: 'Move',
    localField: 'move',
    foreignField: '_id'
})
const Workout = mongoose.model('Workout', workoutSchema)

module.exports = Workout