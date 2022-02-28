exports.filterRequest = requestBody => {
  const data = {}
  for (const key of requestBody) {
    data[key] = requestBody[key]
  }
  return data
}

exports.hidePassword = data => {
  const user = { ...data }
  delete user.password
  return user
}
