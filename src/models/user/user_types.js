const mongoose = require('mongoose')

// Member schema
const memberSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        default: false,
    },
    expireData: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

// Coach schema
const coachSchema = new mongoose.Schema({
    salary: {
        type: Number,
        required: true
    },
    expertises: [{
        expertise: {
            type: String
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
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
}, {
    timestamps: true
})

const Member = mongoose.model('Member', memberSchema)
const Coach = mongoose.model('Coach', coachSchema)
const Bartender = mongoose.model('Bartender', bartenderSchema)

module.exports = {
    Member,
    Coach,
    Bartender
}