// autenticar/requireRol lee JWT_SECRET vía lib/jwt.js al importarse,
// por eso dotenv/config va antes que el import del middleware.
import 'dotenv/config'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { autenticar, requireRol } from '../../src/middlewares/auth.js'
import { firmarToken } from '../../src/lib/jwt.js'
import { ErrorHttp } from '../../src/lib/manejo-de-errores.js'

function reqCon (encabezado) {
  return { headers: { authorization: encabezado } }
}

describe('autenticar', () => {
  it('rechaza cuando falta el header Authorization', () => {
    assert.throws(() => autenticar(reqCon(undefined), {}, () => {}), ErrorHttp)
  })

  it('rechaza un header sin esquema Bearer', () => {
    assert.throws(() => autenticar(reqCon('Token abc'), {}, () => {}), ErrorHttp)
  })

  it('rechaza un token con firma inválida', () => {
    const token = firmarToken({ usuarioId: 1, rol: 'CAJERO' })
    const adulterado = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a')
    assert.throws(() => autenticar(reqCon(`Bearer ${adulterado}`), {}, () => {}), ErrorHttp)
  })

  it('arma req.contexto y llama a next con un token válido', () => {
    const token = firmarToken({ usuarioId: 42, rol: 'DUENIO' })
    const req = reqCon(`Bearer ${token}`)
    let siguienteLlamado = false

    autenticar(req, {}, () => { siguienteLlamado = true })

    assert.equal(siguienteLlamado, true)
    assert.deepEqual(req.contexto, { usuarioId: 42, rol: 'DUENIO' })
  })
})

describe('requireRol', () => {
  it('llama a next cuando el rol del contexto está permitido', () => {
    const req = { contexto: { usuarioId: 1, rol: 'DUENIO' } }
    let siguienteLlamado = false

    requireRol('DUENIO')(req, {}, () => { siguienteLlamado = true })

    assert.equal(siguienteLlamado, true)
  })

  it('rechaza cuando el rol del contexto no está permitido', () => {
    const req = { contexto: { usuarioId: 1, rol: 'CAJERO' } }
    assert.throws(() => requireRol('DUENIO')(req, {}, () => {}), ErrorHttp)
  })

  it('rechaza cuando no hay contexto (sin autenticar)', () => {
    const req = {}
    assert.throws(() => requireRol('DUENIO')(req, {}, () => {}), ErrorHttp)
  })
})
