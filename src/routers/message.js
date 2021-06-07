const express = require('express')
const Message = require('../models/message')
const auth  = require('../middleware/auth')
const permit  = require('../middleware/permit')

const router = new express.Router()

router.post('/messages', auth, async (req, res) => {
    const message = new Message(req.body)

    try{
        await message.save()
        
        res.status(201).send(message)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
}) 

router.get('/messages', auth, permit(''), async (req, res) => {
    try{
        messages = await Message.find({ }).limit()

        res.send(messages)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/messages/:id', auth, permit(''), async (req, res) => {
    try{
        message = await Message.findOneAndDelete({ _id: req.params.id })

        if(!message) {
            return res.status(404).send()
        }

        res.send(message)
    } catch (e) {
        res.status(500).send(e)
    }
})




module.exports = router