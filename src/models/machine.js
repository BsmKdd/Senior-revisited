const mongoose = require('mongoose')


const machineSchema = new mongoose.Schema({
    machineName: {
        type: String,
        required: true,
        trim: true
    },
    machineCode: {
        type: String,
        required: true,
        trim: true
    },
    machineImage: {
        type: Buffer
    },
    location: {
        floor: {
            type: Number
        },
        section: {
            type: String,
            trim: true,
        }
    },
    
})

machineSchema.virtual('move', { ref: 'Move', localField: '_id', foreignField: 'machine'})

machineSchema.methods.toJSON = function () {
    const machine = this
    const machineObject = machine.toObject()

    delete machineObject.machineImage

    return machineObject
}

const Machine = mongoose.model('Machine', machineSchema)

module.exports = Machine