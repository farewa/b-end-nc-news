exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({ message: "Method Not Allowed" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({message: err.message})
  else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const err400Codes = ["22P02","42703"];
  const err404Codes = ['23502', '23503']
  if (err400Codes.includes(err.code)) {
    res.status(400).send({ message: err.msg || "Bad Request" });
  }
  else if (err404Codes.includes(err.code)) {
    res.status(404).send({message: err.msg || 'Route not found'})
  }
   else next(err);
};





