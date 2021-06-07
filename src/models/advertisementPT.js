const mongoose = require('mongoose')
const validator = require('validator')


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
    image: {
        type: Buffer
    },
    banner: {
        type: Buffer
    },
}, {
    timestamps: true
})

const AdvertisementsPT = mongoose.model('advertisementPT', advertisementPTSchema)

module.exports = AdvertisementsPT