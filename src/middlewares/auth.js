// Arma req.contexto = { usuarioId, rol } a partir del JWT de la request,
// y el middleware factory para restringir rutas por rol (RN-30).
import { verificarToken } from '../lib/jwt.js'
import { ErrorHttp } from '../lib/manejo-de-errores.js'

function autenticar (req, res, next) {
  const encabezado = req.headers.authorization || ''
  const [esquema, token] = encabezado.split(' ')

  if (esquema !== 'Bearer' || !token) {
    throw new ErrorHttp(401, 'falta el token de autenticación')
  }

  let payload
  try {
    payload = verificarToken(token)
  } catch {
    throw new ErrorHttp(401, 'token inválido o expirado')
  }

  req.contexto = { usuarioId: payload.usuarioId, rol: payload.rol }
  next()
}

function requireRol (...rolesPermitidos) {
  return function (req, res, next) {
    if (!rolesPermitidos.includes(req.contexto?.rol)) {
      throw new ErrorHttp(403, 'no tiene permisos para esta operación')
    }
    next()
  }
}

export { autenticar, requireRol }
