const userRouter = require('express').Router()
const {getUserByUsername, getAllUsers, postNewUser} = require('../controllers/user-controller')
const {methodNotAllowed} = require('../errors')

userRouter.route('/')
.get(getAllUsers)
.post(postNewUser)
.all(methodNotAllowed)

userRouter.route('/:username')
.get(getUserByUsername)
.all(methodNotAllowed)


module.exports = userRouter