Convenciones: `INTEGER` para todo lo monetario (centavos) y todos los ids. `TEXT` para fechas ISO-8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`) o `DATETIME` de Prisma. Todo `_cents` es entero. Todo `activo` es `BOOLEAN NOT NULL DEFAULT true`. Todo maestro tiene `creado_en` y `actualizado_en`.

### 7.1 `usuario`

| Campo          | Tipo     | Clave  | Nota                                      |
| -------------- | -------- | ------ | ----------------------------------------- |
| id             | INTEGER  | PK     |                                           |
| nombre         | TEXT     |        | Nombre para mostrar.                      |
| usuario        | TEXT     | UNIQUE | Login. Se guarda en minúsculas.           |
| password_hash  | TEXT     |        | bcrypt, cost ≥ 10. Nunca sale de la base. |
| rol            | TEXT     |        | `DUENIO` \| `CAJERO`.                     |
| activo         | BOOLEAN  |        | Baja lógica.                              |
| creado_en      | DATETIME |        |                                           |
| actualizado_en | DATETIME |        |                                           |

### 7.2 `producto`

| Campo                      | Tipo      | Clave | Nota                                                                                             |
| -------------------------- | --------- | ----- | ------------------------------------------------------------------------------------------------ |
| id                         | INTEGER   | PK    |                                                                                                  |
| nombre                     | TEXT      |       | Índice para búsqueda parcial. Es la vía principal de búsqueda: todavía no hay lector.            |
| categoria                  | TEXT NULL |       | Texto libre. Sirve para filtrar la actualización masiva de precios.                              |
| unidad                     | TEXT      |       | `UNIDAD` \| `KG`. Decide si la pantalla pide unidades o kilos. Default `UNIDAD`.                 |
| precio_venta_cents         | INTEGER   |       | Precio vigente por unidad o por kilo, según `unidad`. Se copia a la línea de venta.              |
| costo_cents                | INTEGER   |       | Último costo conocido. Se actualiza en la compra.                                                |
| stock_actual_mil           | INTEGER   |       | **Caché derivado** de `movimiento_stock`, en milésimas. Puede ser negativo.                      |
| stock_minimo_mil           | INTEGER   |       | Umbral para el listado de reposición, en milésimas. Default 0.                                   |
| controla_stock             | BOOLEAN   |       | Default `true`. En `false` (recargas, servicios) no genera movimientos de stock.                 |
| precio_libre               | BOOLEAN   |       | Default `false`. En `true` el cajero tipea el importe al vender (recarga de $2.000, de $5.000…). |
| activo                     | BOOLEAN   |       | Inactivo no aparece en la venta, sí en el historial.                                             |
| creado_en / actualizado_en | DATETIME  |       |                                                                                                  |

### 7.3 `codigo_barra`

| Campo       | Tipo     | Clave         | Nota                                                                 |
| ----------- | -------- | ------------- | -------------------------------------------------------------------- |
| id          | INTEGER  | PK            |                                                                      |
| producto_id | INTEGER  | FK → producto |                                                                      |
| codigo      | TEXT     | UNIQUE        | Un código apunta a un solo producto; un producto puede tener varios. |
| creado_en   | DATETIME |               |                                                                      |

### 7.4 `medio_pago`

| Campo       | Tipo    | Clave  | Nota                                                                                |
| ----------- | ------- | ------ | ----------------------------------------------------------------------------------- |
| id          | INTEGER | PK     |                                                                                     |
| nombre      | TEXT    | UNIQUE | "Efectivo", "Débito", "Mercado Pago QR", "Fiado".                                   |
| tipo        | TEXT    |        | `EFECTIVO` \| `ELECTRONICO` \| `CUENTA_CORRIENTE`. Determina si toca caja o cuenta. |
| comision_bp | INTEGER |        | Puntos básicos. 350 = 3,5 %. Efectivo y fiado: 0.                                   |
| orden       | INTEGER |        | Orden en la pantalla de cobro.                                                      |
| activo      | BOOLEAN |        |                                                                                     |

> Sólo puede existir **un** medio de pago activo de tipo `CUENTA_CORRIENTE`. Validado en el código.

### 7.5 `cliente`

| Campo                      | Tipo         | Clave | Nota                                            |
| -------------------------- | ------------ | ----- | ----------------------------------------------- |
| id                         | INTEGER      | PK    |                                                 |
| nombre                     | TEXT         |       |                                                 |
| telefono                   | TEXT NULL    |       |                                                 |
| limite_credito_cents       | INTEGER NULL |       | Nulo = sin límite definido. Sólo advierte.      |
| saldo_cents                | INTEGER      |       | **Caché derivado**. Positivo = el cliente debe. |
| activo                     | BOOLEAN      |       |                                                 |
| creado_en / actualizado_en | DATETIME     |       |                                                 |

### 7.6 `venta`

| Campo                | Tipo          | Clave            | Nota                                                   |
| -------------------- | ------------- | ---------------- | ------------------------------------------------------ |
| id                   | INTEGER       | PK               |                                                        |
| numero               | INTEGER       | UNIQUE           | Correlativo visible, tomado de `contador`.             |
| fecha                | DATETIME      |                  | Momento de confirmación.                               |
| usuario_id           | INTEGER       | FK → usuario     | Quién vendió.                                          |
| caja_sesion_id       | INTEGER       | FK → caja_sesion | Sesión abierta al confirmar.                           |
| cliente_id           | INTEGER NULL  | FK → cliente     | Obligatorio sólo si hay pago de tipo cuenta corriente. |
| total_cents          | INTEGER       |                  | Suma de subtotales. Snapshot, no se recalcula.         |
| recibido_cents       | INTEGER NULL  |                  | Efectivo entregado por el cliente.                     |
| vuelto_cents         | INTEGER NULL  |                  | `recibido − parte en efectivo del total`.              |
| estado               | TEXT          |                  | `CONFIRMADA` \| `ANULADA`.                             |
| usuario_anulacion_id | INTEGER NULL  | FK → usuario     |                                                        |
| fecha_anulacion      | DATETIME NULL |                  |                                                        |
| motivo_anulacion     | TEXT NULL     |                  | Obligatorio al anular.                                 |

### 7.7 `venta_item`

| Campo                 | Tipo    | Clave         | Nota                                                                                                                  |
| --------------------- | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| id                    | INTEGER | PK            |                                                                                                                       |
| venta_id              | INTEGER | FK → venta    |                                                                                                                       |
| producto_id           | INTEGER | FK → producto | Para reportes; el dato mostrado es `descripcion`.                                                                     |
| descripcion           | TEXT    |               | Snapshot del nombre. Si el producto se renombra, el comprobante no cambia.                                            |
| unidad                | TEXT    |               | Snapshot de `producto.unidad`, para poder mostrar "0,250 kg" en un comprobante viejo.                                 |
| cantidad_mil          | INTEGER |               | **Milésimas.** 1000 = 1 unidad; 250 = 250 g.                                                                          |
| precio_unitario_cents | INTEGER |               | **Congelado**. Precio por unidad o por kilo.                                                                          |
| costo_unitario_cents  | INTEGER |               | **Congelado**. Es lo que hace posible el margen histórico.                                                            |
| subtotal_cents        | INTEGER |               | `redondear(cantidad_mil × precio_unitario_cents / 1000)`. Redundante a propósito, para no recalcular en cada reporte. |

### 7.8 `venta_pago`

| Campo          | Tipo    | Clave           | Nota                                                 |
| -------------- | ------- | --------------- | ---------------------------------------------------- |
| id             | INTEGER | PK              |                                                      |
| venta_id       | INTEGER | FK → venta      |                                                      |
| medio_pago_id  | INTEGER | FK → medio_pago |                                                      |
| monto_cents    | INTEGER |                 | La suma de todos debe igualar `venta.total_cents`.   |
| comision_cents | INTEGER |                 | **Congelada** al confirmar. 0 para efectivo y fiado. |

### 7.9 `movimiento_stock` (append-only)

| Campo                | Tipo         | Clave         | Nota                                                                                                      |
| -------------------- | ------------ | ------------- | --------------------------------------------------------------------------------------------------------- |
| id                   | INTEGER      | PK            |                                                                                                           |
| producto_id          | INTEGER      | FK → producto |                                                                                                           |
| tipo                 | TEXT         |               | `VENTA` \| `ANULACION_VENTA` \| `COMPRA` \| `ANULACION_COMPRA` \| `AJUSTE` \| `MERMA` \| `CARGA_INICIAL`. |
| motivo               | TEXT NULL    |               | Sólo en `MERMA`: `ROTURA` \| `VENCIMIENTO` \| `ROBO` \| `CONSUMO_INTERNO`.                                |
| cantidad_mil         | INTEGER      |               | **Con signo, en milésimas**. Nunca cero.                                                                  |
| costo_unitario_cents | INTEGER NULL |               | Se guarda en compras y cargas iniciales, para valuar el inventario después.                               |
| venta_id             | INTEGER NULL | FK → venta    |                                                                                                           |
| compra_id            | INTEGER NULL | FK → compra   |                                                                                                           |
| usuario_id           | INTEGER      | FK → usuario  |                                                                                                           |
| nota                 | TEXT NULL    |               | Obligatoria en `AJUSTE`.                                                                                  |
| fecha                | DATETIME     |               |                                                                                                           |

### 7.10 `compra`

| Campo                | Tipo          | Clave            | Nota                                                  |
| -------------------- | ------------- | ---------------- | ----------------------------------------------------- |
| id                   | INTEGER       | PK               |                                                       |
| fecha                | DATETIME      |                  |                                                       |
| proveedor_nombre     | TEXT          |                  | Texto libre, con autocompletado de valores ya usados. |
| comprobante_nro      | TEXT NULL     |                  | Remito o factura del proveedor.                       |
| total_cents          | INTEGER       |                  | Suma de subtotales de ítems.                          |
| pago_tipo            | TEXT          |                  | `EFECTIVO_CAJA` \| `OTRO`.                            |
| caja_sesion_id       | INTEGER NULL  | FK → caja_sesion | Sólo si `pago_tipo = EFECTIVO_CAJA`.                  |
| usuario_id           | INTEGER       | FK → usuario     |                                                       |
| estado               | TEXT          |                  | `CONFIRMADA` \| `ANULADA`.                            |
| usuario_anulacion_id | INTEGER NULL  | FK → usuario     |                                                       |
| fecha_anulacion      | DATETIME NULL |                  |                                                       |

### 7.11 `compra_item`

| Campo                | Tipo    | Clave         | Nota                                                                                         |
| -------------------- | ------- | ------------- | -------------------------------------------------------------------------------------------- |
| id                   | INTEGER | PK            |                                                                                              |
| compra_id            | INTEGER | FK → compra   |                                                                                              |
| producto_id          | INTEGER | FK → producto |                                                                                              |
| cantidad_mil         | INTEGER |               | **Milésimas.**                                                                               |
| costo_unitario_cents | INTEGER |               | Por unidad o por kilo, según la unidad del producto.                                         |
| subtotal_cents       | INTEGER |               |                                                                                              |
| actualiza_costo      | BOOLEAN |               | Default `true`. Se desmarca para compras atípicas que no deben mover el costo de referencia. |

### 7.12 `gasto`

| Campo                | Tipo          | Clave            | Nota                                                                         |
| -------------------- | ------------- | ---------------- | ---------------------------------------------------------------------------- |
| id                   | INTEGER       | PK               |                                                                              |
| fecha                | DATETIME      |                  |                                                                              |
| concepto             | TEXT          |                  | `ALQUILER` \| `SERVICIOS` \| `SUELDOS` \| `PROVEEDOR` \| `RETIRO` \| `OTRO`. |
| descripcion          | TEXT          |                  | Texto libre.                                                                 |
| monto_cents          | INTEGER       |                  | Positivo; el signo lo pone el movimiento de caja.                            |
| pago_tipo            | TEXT          |                  | `EFECTIVO_CAJA` \| `OTRO`.                                                   |
| caja_sesion_id       | INTEGER NULL  | FK → caja_sesion |                                                                              |
| usuario_id           | INTEGER       | FK → usuario     |                                                                              |
| estado               | TEXT          |                  | `CONFIRMADO` \| `ANULADO`.                                                   |
| usuario_anulacion_id | INTEGER NULL  | FK → usuario     |                                                                              |
| fecha_anulacion      | DATETIME NULL |                  |                                                                              |

### 7.13 `caja_sesion`

| Campo                  | Tipo          | Clave        | Nota                                                                     |
| ---------------------- | ------------- | ------------ | ------------------------------------------------------------------------ |
| id                     | INTEGER       | PK           |                                                                          |
| fecha_apertura         | DATETIME      |              |                                                                          |
| usuario_apertura_id    | INTEGER       | FK → usuario |                                                                          |
| monto_inicial_cents    | INTEGER       |              | Efectivo declarado al abrir.                                             |
| fecha_cierre           | DATETIME NULL |              |                                                                          |
| usuario_cierre_id      | INTEGER NULL  | FK → usuario | Sólo el que abrió o un `DUENIO` (RN-39).                                 |
| conteo_declarado_cents | INTEGER NULL  |              | Lo que contó el cajero, **antes** de ver el esperado.                    |
| esperado_cents         | INTEGER NULL  |              | Congelado al cierre.                                                     |
| diferencia_cents       | INTEGER NULL  |              | `conteo − esperado`. Congelado. Negativo = falta plata.                  |
| estado                 | TEXT          |              | `ABIERTA` \| `CERRADA`. Índice parcial para garantizar una sola abierta. |
| nota_cierre            | TEXT NULL     |              | Obligatoria si `diferencia ≠ 0`.                                         |

### 7.14 `caja_movimiento` (append-only)

| Campo                | Tipo         | Clave                  | Nota                                                                                                                                             |
| -------------------- | ------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| id                   | INTEGER      | PK                     |                                                                                                                                                  |
| caja_sesion_id       | INTEGER      | FK → caja_sesion       |                                                                                                                                                  |
| tipo                 | TEXT         |                        | `VENTA` \| `ANULACION_VENTA` \| `COBRO_FIADO` \| `GASTO` \| `ANULACION_GASTO` \| `COMPRA` \| `ANULACION_COMPRA` \| `INGRESO_MANUAL` \| `RETIRO`. |
| monto_cents          | INTEGER      |                        | **Con signo**. Nunca cero.                                                                                                                       |
| venta_id             | INTEGER NULL | FK → venta             |                                                                                                                                                  |
| gasto_id             | INTEGER NULL | FK → gasto             |                                                                                                                                                  |
| compra_id            | INTEGER NULL | FK → compra            |                                                                                                                                                  |
| movimiento_cuenta_id | INTEGER NULL | FK → movimiento_cuenta |                                                                                                                                                  |
| usuario_id           | INTEGER      | FK → usuario           |                                                                                                                                                  |
| nota                 | TEXT NULL    |                        | Obligatoria en `INGRESO_MANUAL` y `RETIRO`.                                                                                                      |
| fecha                | DATETIME     |                        |                                                                                                                                                  |

> Como máximo una de las cuatro FKs de origen es no nula. Validado en el código.

### 7.15 `movimiento_cuenta` (append-only)

| Campo         | Tipo         | Clave           | Nota                                                              |
| ------------- | ------------ | --------------- | ----------------------------------------------------------------- |
| id            | INTEGER      | PK              |                                                                   |
| cliente_id    | INTEGER      | FK → cliente    |                                                                   |
| tipo          | TEXT         |                 | `CARGO` \| `PAGO` \| `AJUSTE` \| `ANULACION_CARGO`.               |
| monto_cents   | INTEGER      |                 | **Con signo, nunca cero**. `CARGO` positivo (aumenta deuda), `PAGO` negativo. |
| venta_id      | INTEGER NULL | FK → venta      | Presente en `CARGO` y `ANULACION_CARGO`.                          |
| medio_pago_id | INTEGER NULL | FK → medio_pago | Presente en `PAGO`: con qué pagó.                                 |
| usuario_id    | INTEGER      | FK → usuario    |                                                                   |
| nota          | TEXT NULL    |                 | Obligatoria en `AJUSTE`.                                          |
| fecha         | DATETIME     |                 |                                                                   |

### 7.16 `auditoria` (sólo INSERT)

| Campo         | Tipo         | Clave        | Nota                                                                                     |
| ------------- | ------------ | ------------ | ---------------------------------------------------------------------------------------- |
| id            | INTEGER      | PK           |                                                                                          |
| fecha         | DATETIME     |              |                                                                                          |
| usuario_id    | INTEGER NULL | FK → usuario | Nulo en `LOGIN_FALLIDO` con usuario inexistente.                                         |
| entidad       | TEXT         |              | `venta`, `producto`, `caja_sesion`, `lote_precios`, `sesion`…                            |
| entidad_id    | INTEGER NULL |              |                                                                                          |
| accion        | TEXT         |              | `CREAR` \| `ACTUALIZAR` \| `ANULAR` \| `BAJA` \| `LOGIN` \| `LOGIN_FALLIDO` \| `BACKUP`. |
| datos_antes   | TEXT NULL    |              | JSON serializado. Nulo en creaciones.                                                    |
| datos_despues | TEXT NULL    |              | JSON serializado. Nulo en bajas.                                                         |
| resumen       | TEXT NULL    |              | Una línea legible: "Aumentó 15 % en 84 productos de Golosinas".                          |

### 7.17 `contador`

| Campo  | Tipo    | Clave | Nota                                                |
| ------ | ------- | ----- | --------------------------------------------------- |
| nombre | TEXT    | PK    | Fila semilla: `('venta', 0)`.                       |
| valor  | INTEGER |       | Se incrementa dentro de la transacción de la venta. |

### 7.18 `parametro`

| Campo       | Tipo      | Clave | Nota                                                                                                                         |
| ----------- | --------- | ----- | ---------------------------------------------------------------------------------------------------------------------------- |
| clave       | TEXT      | PK    | `nombre_comercio`, `redondeo_precio_cents` (5000), `redondeo_precio_modo` (`ARRIBA`), `backup_destinos`, `backup_retencion`. |
| valor       | TEXT      |       | Siempre texto; el service que lo lee lo castea al tipo que corresponda.                                                      |
| descripcion | TEXT NULL |       | Para que la pantalla de configuración se explique sola.                                                                      |

### 7.19 `backup_log`

| Campo        | Tipo         | Clave        | Nota                                                  |
| ------------ | ------------ | ------------ | ----------------------------------------------------- |
| id           | INTEGER      | PK           |                                                       |
| fecha        | DATETIME     |              |                                                       |
| tipo         | TEXT         |              | `MANUAL` \| `AUTOMATICO` \| `CIERRE_CAJA`.            |
| ruta         | TEXT         |              | Ruta completa del archivo generado.                   |
| tamano_bytes | INTEGER NULL |              | Un tamaño anormalmente chico es señal de backup roto. |
| estado       | TEXT         |              | `OK` \| `ERROR`.                                      |
| mensaje      | TEXT NULL    |              | Error, si lo hubo.                                    |
| usuario_id   | INTEGER NULL | FK → usuario | Nulo si fue automático.                               |

**Total: 19 tablas.**

---

## 8. Reglas de integridad

### 8.1 Lo que garantiza la base de datos

- **Claves foráneas.** Todas las declaradas en §7, con `PRAGMA foreign_keys = ON` activado en cada conexión (SQLite lo trae apagado por defecto).
- **`ON DELETE RESTRICT` en todo.** Nada se borra, así que ningún borrado en cascada debería existir jamás. La única excepción razonable: `codigo_barra` con cascada desde `producto`, y aun así conviene RESTRICT y baja lógica.
- **UNIQUE:** `usuario.usuario`, `codigo_barra.codigo`, `venta.numero`, `medio_pago.nombre`, `contador.nombre`, `parametro.clave`.
- **Índice único parcial** para RN-21: `CREATE UNIQUE INDEX una_caja_abierta ON caja_sesion(estado) WHERE estado = 'ABIERTA'`. Es la única forma barata de que "una sola caja abierta" sea imposible de violar aun con dos terminales apretando el botón a la vez. Se agrega con una migración SQL manual porque Prisma no expresa índices parciales.
- **NOT NULL** en todo lo que no esté marcado como NULL en §7.
- **CHECK** en los pocos lugares donde vale la pena: `cantidad_mil <> 0` en `movimiento_stock`, `monto_cents <> 0` en `caja_movimiento`, `monto_cents <> 0` en `movimiento_cuenta`, `monto_cents > 0` en `venta_pago`, `saldo_cents >= 0` en `cliente` (RN-40).
- **Índices de rendimiento:** `producto(nombre)`, `venta(fecha)`, `venta(caja_sesion_id)`, `movimiento_stock(producto_id, fecha)`, `caja_movimiento(caja_sesion_id)`, `movimiento_cuenta(cliente_id, fecha)`, `auditoria(fecha)`, `auditoria(entidad, entidad_id)`.
- **WAL activado** (`PRAGMA journal_mode = WAL`) y `busy_timeout = 5000`: lecturas concurrentes sin bloquear la escritura de la venta.
