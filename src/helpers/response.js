exports.errorHandler = (res, message, status) => {
  return res.status(status).json({
    success: false,
    message,
    data: {}
  })
}

exports.successHandler = (res, message, data) => {
  return res.status(200).json({
    success: true,
    message,
    data
  })
}
