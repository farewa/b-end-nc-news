const express = require('express')
const apiRouter = require('./routes/apiRouter')
const {handleCustomErrors, handlePSQLErrors} = require('./errors')

const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api', apiRouter)

app.use(handleCustomErrors)

app.use(handlePSQLErrors)


module.exports = app