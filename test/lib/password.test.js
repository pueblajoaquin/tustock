// Tests de hash/verify de contraseñas (RN-35: bcrypt, cost >= 10).
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { hashearPassword, verificarPassword } from '../../src/lib/password.js'

describe('hashearPassword / verificarPassword', () => {
  it('produce un hash bcrypt con cost >= 10', async () => {
    const hash = await hashearPassword('miPassword123')
    const [, , cost] = hash.split('$')
    assert.ok(Number(cost) >= 10)
  })

  it('el hash nunca es igual al password en texto plano', async () => {
    const hash = await hashearPassword('miPassword123')
    assert.notEqual(hash, 'miPassword123')
  })

  it('verificarPassword acepta el password correcto', async () => {
    const hash = await hashearPassword('miPassword123')
    assert.equal(await verificarPassword('miPassword123', hash), true)
  })

  it('verificarPassword rechaza un password incorrecto', async () => {
    const hash = await hashearPassword('miPassword123')
    assert.equal(await verificarPassword('otroPassword', hash), false)
  })
})
