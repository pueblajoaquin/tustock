// Aritmética de plata pura (RN-01 a RN-06, RN-19). Sin Prisma, sin I/O.
// Todo importe es entero de centavos; toda cantidad es entera en milésimas.
// Ninguna función de este archivo usa división de punto flotante sobre plata.

function enteroONull (valor, nombre) {
  if (!Number.isInteger(valor)) {
    throw new TypeError(`${nombre} debe ser un entero, recibido: ${valor}`)
  }
}

// Redondeo medio hacia arriba de numerador/denominador, sin pasar por Number
// en división (evita el error de punto flotante que arruina el arqueo).
// denominador > 0. numerador puede ser negativo (redondea hacia +Infinito en .5).
function redondearMedioArriba (numerador, denominador) {
  enteroONull(numerador, 'numerador')
  enteroONull(denominador, 'denominador')
  if (denominador <= 0) throw new RangeError('denominador debe ser positivo')

  const cociente = Math.floor(numerador / denominador)
  const resto = numerador - cociente * denominador // siempre en [0, denominador)
  return resto * 2 >= denominador ? cociente + 1 : cociente
}

// RN-03: subtotal_cents = redondear(cantidad_mil × precio_unitario_cents / 1000)
function calcularSubtotalItem ({ cantidadMil, precioUnitarioCents }) {
  enteroONull(cantidadMil, 'cantidadMil')
  enteroONull(precioUnitarioCents, 'precioUnitarioCents')
  if (precioUnitarioCents < 0) throw new RangeError('precioUnitarioCents no puede ser negativo')

  return redondearMedioArriba(cantidadMil * precioUnitarioCents, 1000)
}

// RN-02: el total de la venta es la suma de los subtotales de sus ítems,
// calculada siempre por el servidor. Lo que mande el frontend se ignora.
function calcularTotalVenta (items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new RangeError('una venta debe tener al menos un ítem')
  }

  return items.reduce((total, item) => {
    const subtotal = calcularSubtotalItem(item)
    return total + subtotal
  }, 0)
}

// RN-05: comisión de una línea de pago = redondeo(monto_cents × comision_bp / 10000)
function calcularComision ({ montoCents, comisionBp }) {
  enteroONull(montoCents, 'montoCents')
  enteroONull(comisionBp, 'comisionBp')
  if (montoCents < 0) throw new RangeError('montoCents no puede ser negativo')
  if (comisionBp < 0) throw new RangeError('comisionBp no puede ser negativo')

  return redondearMedioArriba(montoCents * comisionBp, 10000)
}

// RN-04: la suma de los pagos debe ser exactamente igual al total.
function validarPagosIgualanTotal ({ pagos, totalCents }) {
  enteroONull(totalCents, 'totalCents')
  if (!Array.isArray(pagos) || pagos.length === 0) {
    throw new RangeError('una venta debe tener al menos un pago')
  }

  const sumaPagos = pagos.reduce((suma, pago) => {
    enteroONull(pago.montoCents, 'pago.montoCents')
    return suma + pago.montoCents
  }, 0)

  return sumaPagos === totalCents
}

// RN-04: el vuelto es lo que sobra del efectivo recibido sobre la parte del
// total pagada en efectivo. No es un pago ni un ingreso de caja.
function calcularVuelto ({ recibidoCents, parteEfectivoCents }) {
  enteroONull(recibidoCents, 'recibidoCents')
  enteroONull(parteEfectivoCents, 'parteEfectivoCents')
  if (recibidoCents < parteEfectivoCents) {
    throw new RangeError('el efectivo recibido no puede ser menor a la parte en efectivo del total')
  }

  return recibidoCents - parteEfectivoCents
}

const MULTIPLO_REDONDEO = { ARRIBA: 'ARRIBA', ABAJO: 'ABAJO' }

// Segundo paso de RN-06: redondea un monto al múltiplo de `multiploCents` más
// cercano según `modo`, sin pasar por división flotante.
function redondearAMultiplo (montoCents, multiploCents, modo) {
  enteroONull(montoCents, 'montoCents')
  enteroONull(multiploCents, 'multiploCents')
  if (multiploCents <= 0) throw new RangeError('multiploCents debe ser positivo')
  if (modo !== MULTIPLO_REDONDEO.ARRIBA && modo !== MULTIPLO_REDONDEO.ABAJO) {
    throw new RangeError(`modo de redondeo desconocido: ${modo}`)
  }

  const cociente = Math.floor(montoCents / multiploCents)
  const resto = montoCents - cociente * multiploCents
  if (resto === 0) return montoCents

  return modo === MULTIPLO_REDONDEO.ARRIBA ? (cociente + 1) * multiploCents : cociente * multiploCents
}

// RN-06: actualización masiva de precios. Aplica primero el porcentaje sobre
// el precio vigente y recién después el redondeo, en ese orden — redondear
// antes deforma el porcentaje. porcentajeBp usa la misma convención que
// comision_bp (10000 = 100%, puede ser negativo para una rebaja).
function aplicarActualizacionMasiva ({
  precioActualCents,
  porcentajeBp,
  redondeoCents = 5000,
  redondeoModo = MULTIPLO_REDONDEO.ARRIBA
}) {
  enteroONull(precioActualCents, 'precioActualCents')
  enteroONull(porcentajeBp, 'porcentajeBp')
  if (precioActualCents < 0) throw new RangeError('precioActualCents no puede ser negativo')
  if (porcentajeBp <= -10000) throw new RangeError('porcentajeBp no puede anular o invertir el precio')

  const precioConPorcentaje = redondearMedioArriba(precioActualCents * (10000 + porcentajeBp), 10000)
  return redondearAMultiplo(precioConPorcentaje, redondeoCents, redondeoModo)
}

const TIPO_MOVIMIENTO_STOCK = {
  VENTA: 'VENTA',
  MERMA: 'MERMA',
  COMPRA: 'COMPRA',
  CARGA_INICIAL: 'CARGA_INICIAL',
  ANULACION_VENTA: 'ANULACION_VENTA',
  AJUSTE: 'AJUSTE'
}

const SIGNO_FIJO_POR_TIPO = {
  [TIPO_MOVIMIENTO_STOCK.VENTA]: -1,
  [TIPO_MOVIMIENTO_STOCK.MERMA]: -1,
  [TIPO_MOVIMIENTO_STOCK.COMPRA]: 1,
  [TIPO_MOVIMIENTO_STOCK.CARGA_INICIAL]: 1,
  [TIPO_MOVIMIENTO_STOCK.ANULACION_VENTA]: 1
}

// RN-19: el signo de cantidad_mil lo determina el tipo de movimiento, nunca
// quien llama. `cantidadMil` se recibe siempre como magnitud positiva, salvo
// para AJUSTE donde el tipo no fija signo y el llamador decide la dirección.
function aplicarSignoStock ({ tipo, cantidadMil }) {
  enteroONull(cantidadMil, 'cantidadMil')
  if (cantidadMil === 0) throw new RangeError('cantidadMil no puede ser cero')

  if (tipo === TIPO_MOVIMIENTO_STOCK.AJUSTE) {
    return cantidadMil
  }

  const signo = SIGNO_FIJO_POR_TIPO[tipo]
  if (signo === undefined) {
    throw new RangeError(`tipo de movimiento de stock desconocido: ${tipo}`)
  }
  if (cantidadMil < 0) {
    throw new RangeError(`cantidadMil para ${tipo} debe pasarse como magnitud positiva`)
  }

  return signo * cantidadMil
}

export {
  redondearMedioArriba,
  calcularSubtotalItem,
  calcularTotalVenta,
  calcularComision,
  validarPagosIgualanTotal,
  calcularVuelto,
  redondearAMultiplo,
  aplicarActualizacionMasiva,
  aplicarSignoStock,
  TIPO_MOVIMIENTO_STOCK,
  MULTIPLO_REDONDEO
}
