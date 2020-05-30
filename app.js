const express = require('express')
const apiRouter = require('./routes/apiRouter')
const {routeNotFound, badRequest} = require('./errors')
const app = express()


app.use('/api', apiRouter)

app.use('/*', routeNotFound)

app.use(badRequest)


module.exports = app