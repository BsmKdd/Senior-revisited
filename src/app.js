const express = require("express")
require("./db/mongoose")
const userRouter = require('./routers/user')
const machineRouter = require('./routers/machine')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(machineRouter)

module.exports = app