const express = require('express')
const apiRouter = require('./routes/apiRouter')
const {handleCustomErrors, handlePSQLErrors, routeNotFound} = require('./errors')

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.all('/*', routeNotFound)

app.use(handleCustomErrors)

app.use(handlePSQLErrors)


module.exports = app