const express = require('express')
// const multer = require('multer')
// const shapr = require('sharp')
const Workout = require('../models/workout/workout')
const { 
        assignedWorkout, 
        currentWorkout, 
        premadeWorkout, 
        previousWorkout 
    } = require('../models/workout/workout_types')
const auth  = require('../middleware/auth')
const permit  = require('../middleware/permit')
const router = new express.Router()

router.post('/assignedWorkouts', async (req, res) => {
    const workout = new Workout(req.body)
    const assigned = new assignedWorkout({
           workout,
           member: req.body.memberID,
           coach: req.body.coachID
        })
    try{
        await workout.save()
        await assigned.save()
        // Send welcome email goes here
        res.status(201).send({ workout, assigned })
    } catch (e) {
        res.status(400).send(e)
    }
}) 

module.exports = router