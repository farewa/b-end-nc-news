exports.routeNotFound = (req, res, next) => {
  console.log('HERE in notFound')
  res.status(404).send('Route not found');
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log('here IN custom')
  console.log(err.code);
  if (err.status) res.status(err.status).send({message: err.message})
  else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  // console.log(err, 'handle')
  const err400Codes = ["22P02","42703"];
  if (err400Codes.includes(err.code)) {
    res.status(400).send({ message: err.msg || "Bad Request" });
  } else next(err);
};

exports.methodNotAllowed = (req, res, next) => {
  // console.log(err);
  res.status(405).send({ message: "Method Not Allowed" });
};



