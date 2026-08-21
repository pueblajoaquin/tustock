// Tests de la aritmética de plata pura (RN-01 a RN-06, RN-19).
// Sin Prisma, sin servidor, sin base — `node --test test/core`.

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  redondearMedioArriba,
  calcularSubtotalItem,
  calcularTotalVenta,
  calcularComision,
  validarPagosIgualanTotal,
  calcularVuelto,
  redondearAMultiplo,
  aplicarActualizacionMasiva,
  aplicarSignoStock,
  TIPO_MOVIMIENTO_STOCK
} from '../../src/core/calculos.js'

describe('redondearMedioArriba (base de RN-03/RN-05, redondeo medio hacia arriba)', () => {
  it('redondea hacia abajo cuando el resto es menor a la mitad', () => {
    assert.equal(redondearMedioArriba(333250, 1000), 333)
  })

  it('redondea hacia arriba exactamente en la mitad', () => {
    assert.equal(redondearMedioArriba(500, 1000), 1)
    assert.equal(redondearMedioArriba(1500, 1000), 2)
  })

  it('redondea hacia arriba cuando el resto supera la mitad', () => {
    assert.equal(redondearMedioArriba(1600, 1000), 2)
  })

  it('es exacta cuando la división es entera', () => {
    assert.equal(redondearMedioArriba(3000, 1000), 3)
  })

  it('rechaza numerador o denominador no enteros (RN-01: nada de float)', () => {
    assert.throws(() => redondearMedioArriba(10.5, 1000), TypeError)
    assert.throws(() => redondearMedioArriba(10, 1.5), TypeError)
  })

  it('rechaza denominador cero o negativo', () => {
    assert.throws(() => redondearMedioArriba(10, 0), RangeError)
    assert.throws(() => redondearMedioArriba(10, -1000), RangeError)
  })
})

describe('calcularSubtotalItem (RN-03)', () => {
  it('calcula el subtotal de una venta por unidad', () => {
    const subtotal = calcularSubtotalItem({ cantidadMil: 1000, precioUnitarioCents: 1050 })
    assert.equal(subtotal, 1050)
  })

  it('calcula el subtotal de una venta por peso (kg fraccionario)', () => {
    // 0,250 kg a $13,33/kg = $3,333... -> redondea a $3,33
    const subtotal = calcularSubtotalItem({ cantidadMil: 250, precioUnitarioCents: 1333 })
    assert.equal(subtotal, 333)
  })

  it('aplica una sola operación de redondeo, medio hacia arriba, en el límite exacto', () => {
    // 0,500 kg a $0,03/kg (en cents) -> 1,5 cents -> redondea a 2
    const subtotal = calcularSubtotalItem({ cantidadMil: 500, precioUnitarioCents: 3 })
    assert.equal(subtotal, 2)
  })

  it('nunca devuelve un valor no entero', () => {
    const subtotal = calcularSubtotalItem({ cantidadMil: 333, precioUnitarioCents: 333 })
    assert.ok(Number.isInteger(subtotal))
  })

  it('rechaza cantidad o precio no enteros', () => {
    assert.throws(() => calcularSubtotalItem({ cantidadMil: 1.5, precioUnitarioCents: 100 }), TypeError)
  })

  it('rechaza precio negativo', () => {
    assert.throws(() => calcularSubtotalItem({ cantidadMil: 1000, precioUnitarioCents: -100 }), RangeError)
  })
})

describe('calcularTotalVenta (RN-02: el servidor es la única autoridad)', () => {
  it('suma los subtotales de todos los ítems', () => {
    const total = calcularTotalVenta([
      { cantidadMil: 1000, precioUnitarioCents: 1050 },
      { cantidadMil: 2000, precioUnitarioCents: 499 }
    ])
    assert.equal(total, 1050 + 998)
  })

  it('ignora cualquier total que venga inflado desde el ítem: siempre recalcula desde cantidad y precio', () => {
    const itemManipulado = { cantidadMil: 1000, precioUnitarioCents: 1050, totalCents: 999999 }
    const total = calcularTotalVenta([itemManipulado])
    assert.equal(total, 1050)
  })

  it('rechaza una venta sin ítems (RN-09)', () => {
    assert.throws(() => calcularTotalVenta([]), RangeError)
  })
})

describe('validarPagosIgualanTotal y calcularVuelto (RN-04)', () => {
  it('acepta cuando la suma de pagos iguala exactamente el total', () => {
    const ok = validarPagosIgualanTotal({
      pagos: [{ montoCents: 1000 }, { montoCents: 1048 }],
      totalCents: 2048
    })
    assert.equal(ok, true)
  })

  it('rechaza cuando la suma de pagos no iguala el total', () => {
    const ok = validarPagosIgualanTotal({
      pagos: [{ montoCents: 1000 }],
      totalCents: 2048
    })
    assert.equal(ok, false)
  })

  it('rechaza una venta sin pagos (RN-09)', () => {
    assert.throws(() => validarPagosIgualanTotal({ pagos: [], totalCents: 100 }), RangeError)
  })

  it('el vuelto es el excedente del efectivo recibido sobre la parte en efectivo del total', () => {
    const vuelto = calcularVuelto({ recibidoCents: 5000, parteEfectivoCents: 2048 })
    assert.equal(vuelto, 2952)
  })

  it('el vuelto es cero cuando el efectivo recibido es exacto', () => {
    const vuelto = calcularVuelto({ recibidoCents: 2048, parteEfectivoCents: 2048 })
    assert.equal(vuelto, 0)
  })

  it('rechaza un recibido menor a la parte en efectivo del total', () => {
    assert.throws(() => calcularVuelto({ recibidoCents: 1000, parteEfectivoCents: 2048 }), RangeError)
  })
})

describe('calcularComision (RN-05)', () => {
  it('calcula la comisión en puntos básicos', () => {
    const comision = calcularComision({ montoCents: 10000, comisionBp: 350 })
    assert.equal(comision, 350)
  })

  it('es cero para efectivo y fiado (comisionBp = 0)', () => {
    const comision = calcularComision({ montoCents: 10000, comisionBp: 0 })
    assert.equal(comision, 0)
  })

  it('redondea medio hacia arriba en el límite exacto', () => {
    const comision = calcularComision({ montoCents: 1, comisionBp: 5000 })
    assert.equal(comision, 1)
  })

  it('rechaza montos o comisiones negativas', () => {
    assert.throws(() => calcularComision({ montoCents: -1, comisionBp: 350 }), RangeError)
    assert.throws(() => calcularComision({ montoCents: 100, comisionBp: -1 }), RangeError)
  })
})

describe('aplicarActualizacionMasiva (RN-06: porcentaje primero, redondeo después)', () => {
  it('aplica el porcentaje sobre el precio vigente y redondea al múltiplo hacia arriba', () => {
    const nuevoPrecio = aplicarActualizacionMasiva({
      precioActualCents: 987600, // $9.876,00
      porcentajeBp: 1000 // +10%
    })
    // 9.876,00 * 1,10 = 10.863,60 -> múltiplo de $50 hacia arriba -> 10.900,00
    assert.equal(nuevoPrecio, 1090000)
  })

  it('usa por defecto múltiplo de $50 (5000 cents) y modo ARRIBA', () => {
    const conDefaults = aplicarActualizacionMasiva({ precioActualCents: 987600, porcentajeBp: 1000 })
    const conArribaExplicito = aplicarActualizacionMasiva({
      precioActualCents: 987600,
      porcentajeBp: 1000,
      redondeoCents: 5000,
      redondeoModo: 'ARRIBA'
    })
    assert.equal(conDefaults, conArribaExplicito)
  })

  it('en modo ABAJO redondea al múltiplo inferior', () => {
    const nuevoPrecio = aplicarActualizacionMasiva({
      precioActualCents: 987600,
      porcentajeBp: 1000,
      redondeoModo: 'ABAJO'
    })
    assert.equal(nuevoPrecio, 1085000)
  })

  it('no modifica un precio que ya cae en el múltiplo exacto', () => {
    const nuevoPrecio = aplicarActualizacionMasiva({
      precioActualCents: 1000000,
      porcentajeBp: 1000, // 10% de 10.000,00 = 11.000,00, múltiplo exacto de 50
      redondeoCents: 5000,
      redondeoModo: 'ARRIBA'
    })
    assert.equal(nuevoPrecio, 1100000)
  })

  it('permite una rebaja con porcentaje negativo', () => {
    const nuevoPrecio = aplicarActualizacionMasiva({
      precioActualCents: 1100000,
      porcentajeBp: -1000, // -10%
      redondeoModo: 'ABAJO'
    })
    // 11.000,00 * 0,90 = 9.900,00, ya es múltiplo de 50
    assert.equal(nuevoPrecio, 990000)
  })

  it('rechaza un porcentaje que anule o invierta el precio', () => {
    assert.throws(() => aplicarActualizacionMasiva({ precioActualCents: 1000, porcentajeBp: -10000 }), RangeError)
  })
})

describe('redondearAMultiplo', () => {
  it('deja igual un monto que ya es múltiplo', () => {
    assert.equal(redondearAMultiplo(15000, 5000, 'ARRIBA'), 15000)
  })

  it('rechaza un modo desconocido', () => {
    assert.throws(() => redondearAMultiplo(1000, 5000, 'CERCANO'), RangeError)
  })
})

describe('aplicarSignoStock (RN-19)', () => {
  it('VENTA y MERMA restan stock', () => {
    assert.equal(aplicarSignoStock({ tipo: TIPO_MOVIMIENTO_STOCK.VENTA, cantidadMil: 1000 }), -1000)
    assert.equal(aplicarSignoStock({ tipo: TIPO_MOVIMIENTO_STOCK.MERMA, cantidadMil: 500 }), -500)
  })

  it('COMPRA, CARGA_INICIAL y ANULACION_VENTA suman stock', () => {
    assert.equal(aplicarSignoStock({ tipo: TIPO_MOVIMIENTO_STOCK.COMPRA, cantidadMil: 2000 }), 2000)
    assert.equal(aplicarSignoStock({ tipo: TIPO_MOVIMIENTO_STOCK.CARGA_INICIAL, cantidadMil: 100 }), 100)
    assert.equal(aplicarSignoStock({ tipo: TIPO_MOVIMIENTO_STOCK.ANULACION_VENTA, cantidadMil: 1000 }), 1000)
  })

  it('AJUSTE respeta el signo que decide quien llama', () => {
    assert.equal(aplicarSignoStock({ tipo: TIPO_MOVIMIENTO_STOCK.AJUSTE, cantidadMil: -300 }), -300)
    assert.equal(aplicarSignoStock({ tipo: TIPO_MOVIMIENTO_STOCK.AJUSTE, cantidadMil: 300 }), 300)
  })

  it('rechaza cantidad cero (CHECK cantidad_mil <> 0)', () => {
    assert.throws(() => aplicarSignoStock({ tipo: TIPO_MOVIMIENTO_STOCK.VENTA, cantidadMil: 0 }), RangeError)
  })

  it('rechaza un tipo de movimiento desconocido', () => {
    assert.throws(() => aplicarSignoStock({ tipo: 'DEVOLUCION_PROVEEDOR', cantidadMil: 100 }), RangeError)
  })

  it('rechaza magnitud negativa para tipos de signo fijo: el signo lo pone el tipo, no quien llama', () => {
    assert.throws(() => aplicarSignoStock({ tipo: TIPO_MOVIMIENTO_STOCK.VENTA, cantidadMil: -1000 }), RangeError)
  })
})
