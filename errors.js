exports.routeNotFound = (req, res, next) => {
  console.log(err)
  next(err)
}

exports.methodNotAllowed = (req, res) => {
  console.log(err)
  res.status(405).send({msg: 'Method Not Allowed'})
}

exports.badRequest = (err, req, res, next) => {
  const errCodes = ['22P02']
  if (errCodes.includes(err.code)) {
    res.status(400).send({message: err.msg || "Bad Request" })
  }
  else next(err)
}