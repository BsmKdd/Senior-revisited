const express = require('express')
const Workout = require('../../models/workout/workout')
const Move = require('../../models/move')
const { AssignedWorkout } = require('../../models/workout/workout_types')
const auth  = require('../../middleware/auth')
const permit  = require('../../middleware/permit')
const router = new express.Router()

router.post('/assignedWorkouts', auth, permit('Coach'), async (req, res) => {
    const workout = new Workout(req.body)
    workout.workoutType = "Assigned"
    const assigned = new AssignedWorkout({
        member: req.body.member,
        coach: req.user,
        workout
    })

    try{
        await workout.save()
        await assigned.save()
        res.status(201).send({ assigned })
    } catch (e) {
        res.status(400).send(e)
    }
}) 

router.get('/assignedWorkouts/:id', auth, async (req, res) => {
    try{
        const assigned = await AssignedWorkout.findOne({ _id: req.params.id })

        if(!assigned){
            return res.status(404).send({error: "No moves in this workout"})
        }

        await assigned.populate('workout_').execPopulate()
        // await order.populate('bartender').execPopulate()
        var move_ids = []
        try {
            assigned.workout_[0].moves.forEach((move) => { move_ids.push(move.move) })
            
            const moves = await Move.find().where('_id').in(move_ids).exec()

            res.send(moves) 
        } catch (e) {
            console.log(e.message)
        }

    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.get('/assignedWorkouts/member/:id', auth, async (req, res) => {
    try{
        assigneds = await AssignedWorkout.find({ member: req.params.id }).limit()

        res.send(assigneds)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.get('/assignedWorkouts/coach/:id', auth, async (req, res) => {
    try{
        assigneds = await AssignedWorkout.find({ coach: req.params.id }).limit()

        res.send(assigneds)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.get('/assignedWorkouts', auth, async (req, res) => {
    try{
        assigneds = await AssignedWorkout.find({ }).limit()

        res.send(assigneds)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/assignedWorkouts/:id', auth, permit(''), async (req, res) => {
    try{
        const assigned = await AssignedWorkout.findOne({ _id: req.params.id })
        await AssignedWorkout.deleteOne({ _id:assigned._id, workout:assigned.workout })
        
        if(!assigned) {
            return res.status(404).send()
        }

        res.send(assigned)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.patch('/assignedWorkouts/:id', auth, permit('Member', 'Coach'), async (req, res) => {
    const updates = Object.keys(req.body)

    try{
        const assigned = await AssignedWorkout.findOne({ _id: req.params.id })

        if(!assigned){
            return res.status(404).send()
        }

        updates.forEach((update) => assigned[update] = req.body[update])
        await assigned.save()

        res.send(assigned)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

module.exports = router