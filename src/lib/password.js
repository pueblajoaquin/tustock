// Hash y verificación de contraseñas (RN-35: bcrypt, cost >= 10).
import bcrypt from 'bcryptjs'

const COST = 10

function hashearPassword (password) {
  return bcrypt.hash(password, COST)
}

function verificarPassword (password, hash) {
  return bcrypt.compare(password, hash)
}

export { hashearPassword, verificarPassword }
