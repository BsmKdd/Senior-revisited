const express = require("express")
require("./db/mongoose")
const userRouter = require('./routers/user')
const machineRouter = require('./routers/machine')
const moveRouter = require('./routers/move')
const menuItemRouter = require('./routers/menu_item')
const orderRouter = require('./routers/order')
const advertisementPTRouter = require('./routers/advertisementspt')
const messageRouter = require('./routers/message')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(machineRouter)
app.use(moveRouter)
app.use(menuItemRouter)
app.use(orderRouter)
app.use(advertisementPTRouter)
app.use(messageRouter)

module.exports = app