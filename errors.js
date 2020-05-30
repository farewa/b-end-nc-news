exports.routeNotFound = (err, req, res, next) => {
  console.log(err)
  next(err)
}

exports.methodNotAllowed = (req, res) => {
  console.log(err)
  res.status(405).send({msg: 'Method Not Allowed'})
}