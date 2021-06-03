const mongoose = require('mongoose')


const advertisementPTSchema = new mongoose.Schema({
    namePT: {
        type: String,
        required: true,
        trim: true
    },
    descriptionPT: {
        type: String,
        required: true,
        trim: true
    },
    emailPT: {
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
    phonePT: {
        type: String,
    },
    titlePT: {
        type: String,
        required: true,
        trim: true
    },
    pic: {
        type: Buffer
    },
    banner: {
        type: Buffer
    },
}, {
    timestamps: true
})

const advertisementPT = mongoose.model('advertisementPT', advertisementPTSchema)

module.exports = advertisementPT