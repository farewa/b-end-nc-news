const express = require('express')
const apiRouter = require('./routes/apiRouter')
const {routeNotFound} = require('./errors')
const app = express()


app.use('/api', apiRouter)

app.use('/*', routeNotFound)




module.exports = app