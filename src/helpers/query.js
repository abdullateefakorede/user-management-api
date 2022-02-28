exports.hidePassword = data => {
  const user = { ...data }
  delete user.password
  return user
}
