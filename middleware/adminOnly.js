module.exports = (req, res, next) => {
  if (req.headers['x-admin-token'] != '1234') {
    // return res.sendStatus(403)
    const err = new Error('not allow')
    err.status = 403
    return next(err) // error!
  }
  return next() // pass
}
