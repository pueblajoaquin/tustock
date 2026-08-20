## Requerimientos funcionales

### Módulo 1 — Registro de ventas

| Código   | Requerimiento                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| RF-01.1  | Buscar producto por código de barras escaneado, con agregado inmediato a la venta.                              |
| RF-01.2  | Buscar producto por fragmento de nombre y seleccionarlo con teclado.                                            |
| RF-01.3  | Agregar, quitar y cambiar la cantidad de una línea antes de confirmar.                                          |
| RF-01.4  | Ver el total calculado por el servidor en todo momento.                                                         |
| RF-01.5  | Cobrar con uno o varios medios de pago en la misma venta.                                                       |
| RF-01.6  | Ingresar el monto recibido en efectivo y ver el vuelto calculado.                                               |
| RF-01.7  | Asignar la venta a un cliente cuando el medio de pago es cuenta corriente.                                      |
| RF-01.8  | Confirmar la venta y obtener un número correlativo visible.                                                     |
| RF-01.9  | Consultar el comprobante de una venta en pantalla (ítems, pagos, vuelto, usuario, fecha).                       |
| RF-01.10 | Anular una venta confirmada indicando un motivo.                                                                |
| RF-01.11 | Listar y filtrar las ventas del día por usuario y estado.                                                       |
| RF-01.12 | Dar de alta un producto nuevo sin salir de la pantalla de venta (alta rápida: nombre, precio, código opcional). |
| RF-01.13 | Cancelar la venta en curso sin dejar rastro en la base (nunca se persistió).                                    |
| RF-01.14 | Vender un producto por peso ingresando los kilos a mano (ej. 0,250).                                            |
| RF-01.15 | Vender un producto de precio libre (recarga, servicio) tipeando el importe en el momento.                       |

### Módulo 2 — Productos y control de stock

| Código  | Requerimiento                                                                                                                             |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| RF-02.1 | Alta, edición y baja lógica de productos (nombre, categoría, unidad, precio de venta, costo, stock mínimo, controla stock, precio libre). |
| RF-02.2 | Asociar varios códigos de barras a un mismo producto, y quitarlos.                                                                        |
| RF-02.3 | Importar productos desde CSV, con vista previa y reporte de filas rechazadas.                                                             |
| RF-02.4 | Actualizar precios en forma masiva por porcentaje, filtrando por categoría, con redondeo configurable y vista previa antes de aplicar.    |
| RF-02.5 | Registrar un ajuste de stock (conteo físico) que genera el movimiento de diferencia.                                                      |
| RF-02.6 | Registrar una merma con motivo (rotura, vencimiento, robo, consumo interno).                                                              |
| RF-02.7 | Consultar el historial de movimientos de stock de un producto con su origen.                                                              |
| RF-02.8 | Listar productos con stock por debajo del mínimo.                                                                                         |
| RF-02.9 | Recalcular el stock proyectado de uno o todos los productos desde los movimientos.                                                        |

### Módulo 3 — Gastos y compras

| Código  | Requerimiento                                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------- |
| RF-03.1 | Registrar una compra con proveedor, comprobante, ítems, cantidades y costo unitario.                              |
| RF-03.2 | Al confirmar la compra, ingresar el stock de cada ítem y actualizar el costo del producto (desmarcable por ítem). |
| RF-03.3 | Indicar si la compra se pagó en efectivo desde la caja o por fuera.                                               |
| RF-03.4 | Anular una compra confirmada, revirtiendo stock y caja.                                                           |
| RF-03.5 | Registrar un gasto con concepto, descripción y monto.                                                             |
| RF-03.6 | Indicar si el gasto salió de la caja o por fuera.                                                                 |
| RF-03.7 | Anular un gasto.                                                                                                  |
| RF-03.8 | Listar compras y gastos por período y por concepto.                                                               |

### Módulo 4 — Caja

| Código  | Requerimiento                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------- |
| RF-04.1 | Abrir la caja declarando el monto inicial en efectivo.                                                      |
| RF-04.2 | Registrar automáticamente en la caja el efectivo de cada venta, cobro de fiado, gasto y compra en efectivo. |
| RF-04.3 | Registrar ingresos y retiros manuales de efectivo con nota.                                                 |
| RF-04.4 | Ver el detalle de movimientos de la sesión abierta, sin ver el total esperado.                              |
| RF-04.5 | Cerrar la caja ingresando primero el conteo físico y recién después ver esperado y diferencia.              |
| RF-04.6 | Consultar el resumen de una sesión cerrada: inicial, ingresos, egresos, esperado, contado, diferencia.      |
| RF-04.7 | Consultar el total cobrado por medio de pago de la sesión, con su comisión, para ver el neto real.          |

### Módulo 5 — Fiado / cuenta corriente

| Código  | Requerimiento                                                                           |
| ------- | --------------------------------------------------------------------------------------- |
| RF-05.1 | Alta, edición y baja lógica de clientes (nombre, teléfono, límite de crédito opcional). |
| RF-05.2 | Registrar una venta a cuenta corriente, generando el cargo en el saldo del cliente.     |
| RF-05.3 | Advertir —sin bloquear— cuando la venta supera el límite de crédito del cliente.        |
| RF-05.4 | Registrar un pago del cliente, total o parcial, en efectivo o electrónico.              |
| RF-05.5 | Consultar el estado de cuenta de un cliente: movimientos y saldo.                       |
| RF-05.6 | Listar deudores ordenados por saldo y por antigüedad de la deuda más vieja.             |
| RF-05.7 | Registrar un ajuste manual de saldo con motivo obligatorio.                             |

### Módulo 6 — Usuarios y roles

| Código  | Requerimiento                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------- |
| RF-06.1 | Iniciar y cerrar sesión con usuario y contraseña.                                              |
| RF-06.2 | Alta, edición y baja lógica de usuarios con rol `DUENIO` o `CAJERO`.                           |
| RF-06.3 | Cambiar la propia contraseña; el dueño puede resetear la de cualquiera.                        |
| RF-06.4 | Restringir por rol las operaciones sensibles según la matriz de RN-30.                         |
| RF-06.5 | Ocultar en el frontend lo que el rol no puede hacer, sabiendo que el servidor igual lo valida. |

### Módulo 7 — Auditoría

| Código  | Requerimiento                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| RF-07.1 | Registrar automáticamente toda operación sensible: quién, cuándo, qué entidad, qué acción, estado antes y después. |
| RF-07.2 | Registrar los inicios de sesión exitosos y fallidos.                                                               |
| RF-07.3 | Consultar la auditoría filtrando por usuario, entidad, acción y rango de fechas.                                   |
| RF-07.4 | Ver el detalle antes/después de un registro puntual.                                                               |

### Módulo 8 — Backups

| Código  | Requerimiento                                                                              |
| ------- | ------------------------------------------------------------------------------------------ |
| RF-08.1 | Generar un backup consistente de la base bajo demanda, desde la interfaz.                  |
| RF-08.2 | Generar un backup automático al cerrar caja y otro diario programado.                      |
| RF-08.3 | Guardar cada backup en al menos dos destinos configurables (disco local + unidad externa). |
| RF-08.4 | Aplicar retención: conservar los últimos N backups y borrar los más viejos.                |
| RF-08.5 | Registrar cada backup con fecha, ruta, tamaño y resultado.                                 |
| RF-08.6 | Mostrar una advertencia visible si el último backup exitoso tiene más de 24 horas.         |
| RF-08.7 | Restaurar desde un backup mediante un procedimiento documentado y probado.                 |

---

## Reglas de negocio

Estas son las que se testean. Las de cálculo puro tienen al menos un test en `core/`, sin base ni servidor; las que dependen de una transacción se testean contra una base temporal (ver RNF-12).

### Dinero y cálculo

| #     | Regla                                                                                                                                                                                                                                          | Motivo                                                                                                                          |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| RN-01 | Todo importe se almacena y se opera como entero de centavos. Ninguna operación de plata usa punto flotante.                                                                                                                                    | El float acumula error y el arqueo deja de cerrar por centavos que nadie puede explicar.                                        |
| RN-02 | El total de una venta es la suma de los subtotales de sus ítems, calculada **siempre por el servidor**. El total que envía el frontend se ignora.                                                                                              | El cliente es manipulable; el servidor es la única autoridad sobre la plata.                                                    |
| RN-03 | El subtotal de un ítem es `redondear(cantidad_mil × precio_unitario_cents / 1000)`, con **una sola** operación de redondeo, medio hacia arriba.                                                                                                | Con venta por peso la división es inevitable; que ocurra una vez sola y con regla escrita es lo que hace el total reproducible. |
| RN-04 | La suma de los pagos de una venta debe ser exactamente igual al total. El efectivo recibido puede superarlo: la diferencia es el vuelto y no es un pago.                                                                                       | Sin esto, el vuelto se contabiliza como ingreso y la caja da de más.                                                            |
| RN-05 | La comisión de una línea de pago se calcula al confirmar como `redondeo(monto_cents × comision_bp / 10000)` y se congela.                                                                                                                      | El margen histórico no puede cambiar porque el banco cambió su tarifa.                                                          |
| RN-06 | La actualización masiva aplica el porcentaje sobre el precio vigente y **después** el redondeo, en ese orden. Por defecto `redondeo_cents = 5000` y `redondeo_modo = ARRIBA` (múltiplo de $50 hacia arriba), ambos editables en configuración. | Redondear antes deforma el porcentaje. Hacia arriba nunca te deja vendiendo por debajo del aumento que decidiste.               |

### Ventas

| #     | Regla                                                                                                                                                                          | Motivo                                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| RN-07 | Una venta no se puede confirmar si no hay una sesión de caja abierta.                                                                                                          | Sin caja abierta el efectivo no tiene dónde imputarse y el arqueo queda roto.                         |
| RN-08 | El número de venta se obtiene incrementando la fila `contador` dentro de la misma transacción que inserta la venta. Es correlativo y sin huecos.                               | Un rollback con autoincrement deja un número quemado y el hueco no se puede explicar.                 |
| RN-09 | Una venta debe tener al menos un ítem y al menos un pago.                                                                                                                      | Una venta vacía no es una venta.                                                                      |
| RN-10 | Cada ítem congela `descripcion`, `precio_unitario_cents` y `costo_unitario_cents` copiados del producto al momento de confirmar.                                               | Sin snapshot, el primer aumento reescribe la rentabilidad de todo el historial.                       |
| RN-11 | Una venta con pago de tipo `CUENTA_CORRIENTE` exige cliente asignado. Los otros tipos no.                                                                                      | Fiar a nadie es perder la plata.                                                                      |
| RN-12 | La venta se persiste completa o no se persiste: ítems, pagos, movimientos de stock, movimiento de caja y movimiento de cuenta ocurren en una única transacción.                | Una venta a medias es peor que ninguna venta.                                                         |
| RN-13 | Si el stock proyectado no alcanza, la venta **se permite** y se devuelve una advertencia. Nunca se bloquea.                                                                    | Con el producto en la mano del cliente, un bloqueo hace que se abandone el sistema.                   |
| RN-14 | Una venta anulada no se edita ni se borra: cambia a estado `ANULADA` y genera movimientos inversos de stock, de caja y de cuenta corriente.                                    | El historial es el activo del sistema.                                                                |
| RN-15 | Una venta ya anulada no se puede anular de nuevo.                                                                                                                              | Doble reversión duplica stock y plata.                                                                |
| RN-16 | Los movimientos inversos de una anulación se imputan a la sesión de caja **abierta al momento de anular**, no a la original.                                                   | Si se imputaran a una sesión cerrada, un arqueo ya firmado cambiaría después.                         |
| RN-36 | Un ítem cuyo producto tiene `precio_libre = true` toma el precio que tipea el cajero. En todos los demás el precio lo pone el servidor y lo que mande el frontend se descarta. | Es la única puerta por donde un precio puede venir del cliente, y está marcada como dato en la tabla. |
| RN-37 | Un producto con `unidad = UNIDAD` sólo acepta cantidades múltiplo de 1000. Con `unidad = KG` acepta cualquier múltiplo de 1.                                                   | Evita vender media Coca por un error de tipeo.                                                        |

### Stock

| #     | Regla                                                                                                                                                                                      | Motivo                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| RN-17 | `movimiento_stock` es append-only: no se actualiza ni se borra ningún registro.                                                                                                            | Es la fuente de verdad; si se edita, deja de serlo.                               |
| RN-18 | `producto.stock_actual` es una proyección: siempre igual a la suma de `cantidad` de sus movimientos. Se actualiza en la misma transacción que inserta el movimiento y se puede recalcular. | Es caché por velocidad, no por autoridad.                                         |
| RN-19 | El signo de la cantidad lo determina el tipo: `VENTA`, `MERMA` negativos; `COMPRA`, `CARGA_INICIAL`, `ANULACION_VENTA` positivos; `AJUSTE` cualquiera.                                     | Que el signo dependa de quien llama es la forma más común de descuadrar el stock. |
| RN-20 | Una merma exige motivo. Un ajuste exige nota.                                                                                                                                              | Sin motivo, la merma es indistinguible del robo.                                  |
| RN-38 | Un producto con `controla_stock = false` (recargas, servicios) no genera `movimiento_stock` ni advertencia de faltante.                                                                    | La recarga de celular no tiene góndola.                                           |

### Caja

| #     | Regla                                                                                                                                                                                                                                                   | Motivo                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| RN-21 | Puede haber a lo sumo **una** sesión de caja en estado `ABIERTA` en todo el sistema.                                                                                                                                                                    | Dos cajas abiertas hacen que el efectivo no tenga dueño.                             |
| RN-22 | Sólo los pagos de tipo `EFECTIVO` generan movimiento de caja. Débito, crédito, QR y cuenta corriente no la tocan.                                                                                                                                       | El arqueo pasa a ser una sola suma que cierra siempre.                               |
| RN-23 | El cierre exige el conteo declarado **antes** de mostrar el esperado. `esperado_cents` y `diferencia_cents` se calculan y congelan en el cierre.                                                                                                        | Si ve el esperado primero, el cajero escribe ese número y el control desaparece.     |
| RN-24 | Una sesión cerrada es inmutable: no admite nuevos movimientos ni recierre.                                                                                                                                                                              | Un arqueo que se puede editar no es un arqueo.                                       |
| RN-25 | El esperado es `monto_inicial + Σ movimientos de la sesión`.                                                                                                                                                                                            | Una sola fórmula, verificable a mano con la calculadora del mostrador.               |
| RN-39 | La sesión pertenece al usuario que la abrió: en el cambio de cajero se cierra una y se abre otra. Sólo puede cerrarla ese usuario o un `DUENIO`. Al iniciar sesión, si hay una caja abierta de otro usuario, el sistema lo avisa antes de dejar vender. | Es lo que convierte al arqueo en un control por persona y no en un promedio del día. |

### Fiado

| #     | Regla                                                                                                                                                    | Motivo                                                                                       |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| RN-26 | `cliente.saldo_cents` es proyección de `movimiento_cuenta`. Positivo significa que el cliente debe.                                                      | Misma lógica que el stock: movimientos como verdad, saldo como caché.                        |
| RN-27 | Superar el límite de crédito genera advertencia, nunca bloqueo.                                                                                          | El dueño decide, no el sistema.                                                              |
| RN-28 | Un pago de cuenta corriente no puede ser mayor al saldo adeudado; si lo es, se rechaza y se sugiere un ajuste.                                           | Un saldo negativo sin querer es un error de tipeo, no un crédito a favor.                    |
| RN-29 | Un movimiento de cuenta pagado en efectivo genera su movimiento de caja en la misma transacción.                                                         | Cobrar fiado es plata que entra al cajón.                                                    |
| RN-40 | `cliente.saldo_cents` nunca queda negativo, y no existe la venta pagada "con saldo a favor". Ningún movimiento puede llevar el saldo por debajo de cero. | Confirmado con el negocio: no pasa. Permitirlo obligaría a modelar un crédito que nadie usa. |

### Usuarios, auditoría y borrado

| #     | Regla                                                                                                                                                                                                                                                                                                                                                                    | Motivo                                                                                                                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RN-30 | Matriz de permisos: el `CAJERO` puede vender, **anular ventas**, cobrar fiado, abrir y cerrar su propia caja, registrar gastos y hacer ingresos y retiros. El `DUENIO` además puede anular compras, ajustar stock, editar precios, hacer actualizaciones masivas, registrar compras, ajustar saldos, administrar usuarios, ver auditoría y márgenes, y disparar backups. | El cajero tiene que poder deshacer su propio error sin salir a buscar al dueño. Lo que sigue reservado al dueño es lo que puede **tapar** un faltante, no lo que puede corregirlo a la vista. |
| RN-31 | Debe existir siempre al menos un usuario activo con rol `DUENIO`. No se puede dar de baja al último.                                                                                                                                                                                                                                                                     | Dejar el sistema sin administrador es irreversible sin tocar la base.                                                                                                                         |
| RN-32 | Ningún registro maestro se elimina físicamente: `activo = false`. Un producto o cliente inactivo no aparece en la búsqueda de venta pero sí en el historial.                                                                                                                                                                                                             | Borrar un producto rompería las FKs del historial.                                                                                                                                            |
| RN-33 | `auditoria` sólo admite INSERT. No hay endpoint de edición ni de borrado.                                                                                                                                                                                                                                                                                                | Una auditoría editable no prueba nada.                                                                                                                                                        |
| RN-34 | Toda operación que cambie plata, stock o permisos deja un registro de auditoría con el usuario responsable en la misma transacción.                                                                                                                                                                                                                                      | Si la auditoría es opcional, el día que importe va a faltar.                                                                                                                                  |
| RN-35 | La contraseña se guarda sólo como hash bcrypt (cost ≥ 10) y nunca se registra en logs ni en auditoría.                                                                                                                                                                                                                                                                   | Es la única regla de seguridad que realmente aplica en una red local.                                                                                                                         |

---

## Requerimientos no funcionales

| Código | Requerimiento               | Criterio de aceptación medible                                                                                                                                                                                                    |
| ------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF-01 | Velocidad de venta          | Confirmar una venta de 10 ítems responde en menos de 500 ms (percentil 95) en la PC objetivo del comercio.                                                                                                                        |
| RNF-02 | Velocidad de búsqueda       | Con 3.000 productos cargados, la búsqueda por nombre devuelve los primeros 20 resultados en menos de 200 ms.                                                                                                                      |
| RNF-03 | Independencia de internet   | Con el cable de red desconectado, el flujo completo abrir caja → vender → cobrar → cerrar caja se ejecuta sin errores. Ninguna pantalla del flujo de venta pide recursos a dominios externos (verificable en la pestaña Network). |
| RNF-04 | Resistencia a corte de luz  | Matando el proceso del backend en medio de una venta 10 veces seguidas, la base queda íntegra y no queda ninguna venta parcial (0 ventas sin ítems, 0 movimientos huérfanos).                                                     |
| RNF-05 | Recuperación ante desastre  | Existe un procedimiento escrito de restauración; un simulacro sobre una PC limpia se completa en menos de 15 minutos y queda registrado con fecha.                                                                                |
| RNF-06 | Disponibilidad al arranque  | Al encender la PC, el backend queda respondiendo en menos de 60 segundos sin intervención manual.                                                                                                                                 |
| RNF-07 | Operación por teclado       | El flujo de venta se completa sin tocar el mouse: escanear o buscar, cantidad, medio de pago, monto, confirmar. Medido con un caso de prueba real de punta a punta.                                                               |
| RNF-08 | Integridad del dinero       | Ningún campo monetario es de tipo `Float` o `Decimal` en el schema. Un test automatizado falla si aparece uno.                                                                                                                    |
| RNF-09 | Atomicidad                  | Toda operación que escribe en más de una tabla corre dentro de una única transacción. Revisión sobre las 8 operaciones compuestas del sistema: 8/8.                                                                               |
| RNF-10 | Recalculabilidad            | El recálculo completo de stock y saldos sobre 5.000 productos y 100.000 movimientos termina en menos de 30 segundos.                                                                                                              |
| RNF-11 | Trazabilidad                | Toda operación listada en RN-34 genera exactamente un registro de auditoría con usuario no nulo. Verificado con un test por operación.                                                                                            |
| RNF-12 | Testeabilidad de las reglas | Cada regla RN-01 a RN-40 tiene al menos un test automatizado. Las de cálculo puro (dinero, cantidades, redondeo, signos) corren sin base ni servidor; las demás contra una base temporal. Cobertura: 40/40.                       |
