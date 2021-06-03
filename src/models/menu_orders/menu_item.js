const mongoose = require('mongoose')


const menuItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    itemDescription: {
        type: String,
        required: true,
        trim: true
    },
    itemType: {
        type: String,
        required: true,
        default: 'item',
        enum: ['item', 'meal', 'drink', 'salad', 'bar'],
        immutable: true
    },
    itemImage: {
        type: Buffer
    },
    nutrionFacts:{
        calories: Number,
        fats: Number,
        protein: Number,
        carbohydrates: Number,
        sugar: Number
    },
    itemPrice: Number,
    preparation: Number,
    stock: Number    
})

menuItemSchema.virtual('order', { ref: 'Order', localField: '_id', foreignField: 'item'})

const menuItem = mongoose.model('menuItem', menuItemSchema)

module.exports = menuItem