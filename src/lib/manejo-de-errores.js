// Errores HTTP explícitos (status + mensaje) y el middleware final que los
// traduce a JSON. Sin esto, Express 5 responde con su página HTML default
// ante cualquier throw async.

class ErrorHttp extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
  }
}

// eslint-disable-next-line no-unused-vars
function manejarErrores (error, req, res, next) {
  if (error instanceof ErrorHttp) {
    res.status(error.status).json({ error: error.message })
    return
  }

  console.error(error)
  res.status(500).json({ error: 'Error interno del servidor' })
}

export { ErrorHttp, manejarErrores }
