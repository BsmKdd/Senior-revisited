const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Move = require('../models/move')
const Machine = require('../models/machine')
const auth  = require('../middleware/auth')
const permit  = require('../middleware/permit')
const im = require('imagemagick')

const router = new express.Router()

const upload = multer({
    limits: { 
        fileSize: 10000000 
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)/)) {
            cb(new Error('Allowed file types: jpg,jpeg,png,gif.'))
        }

        cb(undefined, true)
    }
})

router.post('/moves', auth, permit(''), upload.fields([
    { name: 'moveImage1', maxCount: 1 }, 
    { name: 'moveImage2', maxCount: 1 }, 
    { name: 'moveGif', maxCount: 1 }]), async (req, res) => {

    const move = new Move(req.body)

    const images = req.files 
    
    try{

        if(images.moveImage1) {
            const image1 = images.moveImage1[0].buffer
            const buffer1 = await sharp(image1).resize({ width: 250, height: 250 }).png().toBuffer()
            move.moveImage1 = buffer1
        }
    
        if(images.moveImage2) {
            const image2 = images.moveImage2[0].buffer
            const buffer2 = await sharp(image2).resize({ width: 250, height: 250 }).png().toBuffer()
            move.moveImage2 = buffer2
        }
    
        if(images.moveGif) {
            const gif = images.moveGif[0].buffer
            // const buffer3 = await sharp(gif, {animated: true}).resize({ width:250, height: 250 }).toBuffer()
            move.moveGif = gif
        }


        await move.save()
        res.status(201).send(move)
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.post('/moves/:id/moveImages', auth, permit(), upload.fields([
    { name: 'moveImage1', maxCount: 1 }, 
    { name: 'moveImage2', maxCount: 1 }, 
    { name: 'moveGif', maxCount: 1 }]), async (req, res) => {
    
    const images = req.files 
    const move = await Move.findById(req.params.id)

    if(!move){
        return res.status(404).send()
    }

    if(images.moveImage1) {
        const image1 = images.moveImage1[0].buffer
        const buffer1 = await sharp(image1).resize({ width: 250, height: 250 }).png().toBuffer()
        move.moveImage1 = buffer1
    }

    if(images.moveImage2) {
        const image2 = images.moveImage2[0].buffer
        const buffer2 = await sharp(image2).resize({ width: 250, height: 250 }).png().toBuffer()
        move.moveImage2 = buffer2
    }

    if(images.moveGif) {
        const gif = images.moveGif[0].buffer
        // const buffer3 = await sharp(gif, {animated: true}).resize({ width:250, height: 250 }).toBuffer()
        move.moveGif = gif
    }

    await move.save()

    res.send("Image(s) uploaded")
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.patch('/moves/:id', auth, permit(''), upload.fields([
    { name: 'moveImage1', maxCount: 1 }, 
    { name: 'moveImage2', maxCount: 1 }, 
    { name: 'moveGif', maxCount: 1 }]), async (req, res) => {
    const updates = Object.keys(req.body)

    try{
        const images = req.files 
        const move = await Move.findById(req.params.id)

        if(!move){
            return res.status(404).send()
        }

        updates.forEach((update) => move[update] = req.body[update])

        if(images.moveImage1) {
            const image1 = images.moveImage1[0].buffer
            const buffer1 = await sharp(image1).resize({ width: 250, height: 250 }).png().toBuffer()
            move.moveImage1 = buffer1
        }
    
        if(images.moveImage2) {
            const image2 = images.moveImage2[0].buffer
            const buffer2 = await sharp(image2).resize({ width: 250, height: 250 }).png().toBuffer()
            move.moveImage2 = buffer2
        }
    
        if(images.moveGif) {
            const gif = images.moveGif[0].buffer
            // const buffer3 = await sharp(gif, {animated: true}).resize({ width:250, height: 250 }).toBuffer()
            move.moveGif = gif
        }

        await move.save()

        res.send(move)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/moves', auth, async (req, res) => {
    try{
        moves = await Move.find({ }).limit()

        res.send(moves)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

// Get the machine that a move is performed on
router.get('/machines/:id', auth, async (req, res) => {
    try{
        machine = await Machine.findOne({ _id: req.params.id })

        res.send(machine)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/moves/:id', auth, permit('Admin'), async (req, res) => {
    try{
        move = await Move.findOneAndDelete({ _id: req.params.id })

        if(!move) {
            return res.status(404).send()
        }

        res.send(move)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/machines/:id/machineImage', auth, permit(), async (req, res) => {
    const machine = await Machine.findById(req.params.id)
    machine.machineImage = undefined
    await machine.save()
    res.send()
})

router.patch('/machines/:id', auth, permit(''), async (req, res) => {
    const updates = Object.keys(req.body)

    try{
        const machine = await Machine.findOne({ _id: req.params.id })

        if(!machine){
            return res.status(404).send()
        }

        updates.forEach((update) => machine[update] = req.body[update])
        await machine.save()

        res.send(machine)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/machines/:id/machineImage', async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id)

        if (!machine || !machine.machineImage){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(machine.machineImage)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router