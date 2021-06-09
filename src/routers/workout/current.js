const express = require('express')
const Mongoose = require('mongoose')
const Workout = require('../../models/workout/workout')
const Move = require('../../models/move')
const { CurrentWorkout } = require('../../models/workout/workout_types')
const auth  = require('../../middleware/auth')
const permit  = require('../../middleware/permit')
const router = new express.Router()

router.post('/currentWorkouts', auth, async (req, res) => {
    const workout = new Workout(req.body)
    workout.workoutType = "Current"
    const current = new CurrentWorkout({
        member: req.user,
        coach: req.body.coach,
        workout
    })

    try{
        await workout.save()
        await current.save()
        res.status(201).send({ workout, current })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
}) 

router.get('/currentWorkouts/:id', auth, async (req, res) => {
    try{
        const current = await currentWorkout.findOne({ _id: req.params.id })

        if(!current){
            return res.status(404).send({error: "No moves in this workout"})
        }

        await current.populate('workout_').execPopulate()
        // await order.populate('bartender').execPopulate()
        var move_ids = []
        try {
            current.workout_[0].moves.forEach((move) => { move_ids.push(move.move) })
            
            const moves = await Move.find().where('_id').in(move_ids).exec()

            res.send(moves) 
        } catch (e) {
            console.log(e.message)
        }

    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.get('/currentWorkouts/member/:id', auth, async (req, res) => {
    try{
        currents = await currentWorkout.find({ member: req.params.id }).limit()

        res.send(currents)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.get('/currentWorkouts', auth, async (req, res) => {
    try{
        currents = await currentWorkout.find({ }).limit()

        res.send(currents)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/currentWorkouts/:id', auth, async (req, res) => {
    try{
        const current = await currentWorkout.findOne({ _id: req.params.id })
        await currentWorkout.deleteOne({ _id:current._id, workout:current.workout })
        
        if(!current) {
            return res.status(404).send()
        }

        res.send(current)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.patch('/currentWorkouts/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)

    try{
        const current = await currentWorkout.findOne({ _id: req.params.id })

        if(!current){
            return res.status(404).send()
        }

        updates.forEach((update) => current[update] = req.body[update])
        await current.save()

        res.send(current)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.patch('/currentWorkouts/addMove/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)

    try{
        const current = await CurrentWorkout.findOne({ _id: req.params.id })
        const workout = await Workout.findOne({ _id: current.workout })
        const newMove = req.body.move

        var existingMoves = []
        workout.moves.forEach((move) => existingMoves.push(String(move.move)))
        
        console.log(existingMoves[0])
        console.log(newMove.id)

        if(!current) {
            return res.status(404).send()
        }

        if(existingMoves.includes(newMove.id)) {
            return res.status(500).send({ error: "Can not add duplicate moves." })
        }

        workout.moves.push({move: newMove.id, reps: newMove.reps})
   
        await workout.save()

        res.send(workout)

    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})



module.exports = router