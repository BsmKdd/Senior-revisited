const express = require("express")
require("./db/mongoose")
const userRouter = require('./routers/user')
const machineRouter = require('./routers/machine')
const moveRouter = require('./routers/move')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(machineRouter)
app.use(moveRouter)

module.exports = app