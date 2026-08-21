// Firma y verificación de JWT para la sesión de usuario.
// El payload es siempre { usuarioId, rol } — lo mismo que req.contexto.
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h'

if (!JWT_SECRET) {
  throw new Error('falta JWT_SECRET en las variables de entorno')
}

function firmarToken ({ usuarioId, rol }) {
  return jwt.sign({ usuarioId, rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function verificarToken (token) {
  return jwt.verify(token, JWT_SECRET)
}

export { firmarToken, verificarToken }
