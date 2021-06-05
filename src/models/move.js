const mongoose = require('mongoose')


const moveSchema = new mongoose.Schema({
    moveName: {
        type: String,
        required: true,
        trim: true
    },
    moveDescription: {
        type: String,
        required: true
    },
    // muscleGroups: [{
    //     muscleGroup:{
    //         type: String,
    //         default: 'Core',
    //         enum: ['Core', 'Legs', 'Chest', 'Calves', 'Triceps', 'Biceps', 'Back', 'Forearms']
    //     }
    // }],
    muscleGroups: {
        type: [String],
        enum: ['Core', 'Legs', 'Chest', 'Calves', 'Triceps', 'Biceps', 'Back', 'Forearms']        
    },
    moveDifficulty: {
        type: String,
        default: 'Beginner',
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        immutable: true
    },
    machine:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'machine'
    },
    moveImage1: {
        type: Buffer
    },
    moveImage2: {
        type: Buffer
    },
    moveGif: {
        type: Buffer
    },
})

moveSchema.virtual('./workout/workout', { ref: 'Workout', localField: '_id', foreignField: 'move'})

const Move = mongoose.model('Move', moveSchema)

module.exports = Move