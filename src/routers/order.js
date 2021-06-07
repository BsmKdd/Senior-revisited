const express = require('express')
const Order = require('../models/menu_orders/order')
const MenuItem = require('../models/menu_orders/menu_item')
const auth  = require('../middleware/auth')
const permit  = require('../middleware/permit')
const Mongoose = require('mongoose')

const router = new express.Router()

router.post('/orders', auth, async (req, res) => {
    const order = new Order(req.body)

    try{
        await order.save()
        
        res.status(201).send(order)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
}) 

router.get('/orders/:id', auth, async (req, res) => {
    try{
        const order = await Order.findById(req.params.id)
        // await order.populate('member').execPopulate()
        // await order.populate('bartender').execPopulate()
        var item_ids = []
        try {
            order.items.forEach((item) => { item_ids.push(item.item) })
            
            const items = await MenuItem.find().where('_id').in(item_ids).exec()

            res.send(items) 
        } catch (e) {
            console.log(e.message)
        }
        // const member = await User.findById(order.member[0].user)
        // const bartender = await User.findById(order.bartender[0].user)
        // const items = await User.findById(order.menuItem)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/orders', auth, permit('Bartender'), async (req, res) => {
    try{
        orders = await Order.find({ }).limit()

        res.send(orders)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})




module.exports = router