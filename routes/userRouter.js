const userRouter = require('express').Router()
const {getUserByUsername} = require('../controllers/user-controller')
const {methodNotAllowed} = require('../errors')

userRouter.route('/:username')
.get(getUserByUsername)
.all(methodNotAllowed)


module.exports = userRouter