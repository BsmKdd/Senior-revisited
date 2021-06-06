const mongoose = require('mongoose')


const nutritionSchema = new mongoose.Schema({
    calories: Number,
    fats: Number,
    protein: Number,
    carbohydrates: Number,
    sugar: Number
})

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
        enum: ['item', 'meal', 'drink', 'salad', 'bar']
    },
    itemImage: {
        type: Buffer
    },
    nutritionFacts: nutritionSchema,
    itemPrice: Number,
    preparation: Number,
    stock: Number    
})

menuItemSchema.virtual('order', { ref: 'Order', localField: '_id', foreignField: 'item'})

const menuItem = mongoose.model('menuItem', menuItemSchema)

module.exports = menuItem