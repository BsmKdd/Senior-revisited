const mongoose = require('mongoose')
const { Member, Bartender } = require('.././user/user_types')


const orderSchema = new mongoose.Schema({
    memberID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    bartenderID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Bartender'
    },
    status: {
        type: String,
        default: 'ordered',
        enum: ['ordered', 'confirmed', 'denied', 'served', 'unserved'],
        immutable: true
    },
    items:[{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'menuItem'
        }
    }],
    total: Number
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order