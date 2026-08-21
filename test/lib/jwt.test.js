// Tests de firma/verificación de JWT. jwt.js lee JWT_SECRET al importarse,
// por eso dotenv/config va antes que el import de jwt.js.
import 'dotenv/config'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import { firmarToken, verificarToken } from '../../src/lib/jwt.js'

describe('firmarToken / verificarToken', () => {
  it('firma un token que verificarToken decodifica con el mismo payload', () => {
    const token = firmarToken({ usuarioId: 7, rol: 'CAJERO' })
    const payload = verificarToken(token)
    assert.equal(payload.usuarioId, 7)
    assert.equal(payload.rol, 'CAJERO')
  })

  it('rechaza un token con firma inválida', () => {
    const token = firmarToken({ usuarioId: 7, rol: 'CAJERO' })
    const tokenAdulterado = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a')
    assert.throws(() => verificarToken(tokenAdulterado), jwt.JsonWebTokenError)
  })

  it('rechaza un token expirado', () => {
    const tokenExpirado = jwt.sign(
      { usuarioId: 7, rol: 'CAJERO' },
      process.env.JWT_SECRET,
      { expiresIn: -1 }
    )
    assert.throws(() => verificarToken(tokenExpirado), jwt.TokenExpiredError)
  })
})
