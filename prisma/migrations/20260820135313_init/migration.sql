-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT,
    "unidad" TEXT NOT NULL DEFAULT 'UNIDAD',
    "precio_venta_cents" INTEGER NOT NULL,
    "costo_cents" INTEGER NOT NULL,
    "stock_actual_mil" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo_mil" INTEGER NOT NULL DEFAULT 0,
    "controla_stock" BOOLEAN NOT NULL DEFAULT true,
    "precio_libre" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "codigo_barra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "producto_id" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "codigo_barra_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medio_pago" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "comision_bp" INTEGER NOT NULL DEFAULT 0,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "limite_credito_cents" INTEGER,
    "saldo_cents" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" DATETIME NOT NULL,
    CHECK ("saldo_cents" >= 0)
);

-- CreateTable
CREATE TABLE "venta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "caja_sesion_id" INTEGER NOT NULL,
    "cliente_id" INTEGER,
    "total_cents" INTEGER NOT NULL,
    "recibido_cents" INTEGER,
    "vuelto_cents" INTEGER,
    "estado" TEXT NOT NULL,
    "usuario_anulacion_id" INTEGER,
    "fecha_anulacion" DATETIME,
    "motivo_anulacion" TEXT,
    CONSTRAINT "venta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "venta_usuario_anulacion_id_fkey" FOREIGN KEY ("usuario_anulacion_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "venta_caja_sesion_id_fkey" FOREIGN KEY ("caja_sesion_id") REFERENCES "caja_sesion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "venta_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "venta_item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "venta_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "cantidad_mil" INTEGER NOT NULL,
    "precio_unitario_cents" INTEGER NOT NULL,
    "costo_unitario_cents" INTEGER NOT NULL,
    "subtotal_cents" INTEGER NOT NULL,
    CONSTRAINT "venta_item_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "venta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "venta_item_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "venta_pago" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "venta_id" INTEGER NOT NULL,
    "medio_pago_id" INTEGER NOT NULL,
    "monto_cents" INTEGER NOT NULL,
    "comision_cents" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "venta_pago_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "venta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "venta_pago_medio_pago_id_fkey" FOREIGN KEY ("medio_pago_id") REFERENCES "medio_pago" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK ("monto_cents" > 0)
);

-- CreateTable
CREATE TABLE "movimiento_stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "producto_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "motivo" TEXT,
    "cantidad_mil" INTEGER NOT NULL,
    "costo_unitario_cents" INTEGER,
    "venta_id" INTEGER,
    "compra_id" INTEGER,
    "usuario_id" INTEGER NOT NULL,
    "nota" TEXT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "movimiento_stock_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "movimiento_stock_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "venta" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "movimiento_stock_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "compra" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "movimiento_stock_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK ("cantidad_mil" <> 0)
);

-- CreateTable
CREATE TABLE "compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL,
    "proveedor_nombre" TEXT NOT NULL,
    "comprobante_nro" TEXT,
    "total_cents" INTEGER NOT NULL,
    "pago_tipo" TEXT NOT NULL,
    "caja_sesion_id" INTEGER,
    "usuario_id" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "usuario_anulacion_id" INTEGER,
    "fecha_anulacion" DATETIME,
    CONSTRAINT "compra_caja_sesion_id_fkey" FOREIGN KEY ("caja_sesion_id") REFERENCES "caja_sesion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "compra_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "compra_usuario_anulacion_id_fkey" FOREIGN KEY ("usuario_anulacion_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "compra_item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "compra_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad_mil" INTEGER NOT NULL,
    "costo_unitario_cents" INTEGER NOT NULL,
    "subtotal_cents" INTEGER NOT NULL,
    "actualiza_costo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "compra_item_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "compra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "compra_item_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gasto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL,
    "concepto" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto_cents" INTEGER NOT NULL,
    "pago_tipo" TEXT NOT NULL,
    "caja_sesion_id" INTEGER,
    "usuario_id" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "usuario_anulacion_id" INTEGER,
    "fecha_anulacion" DATETIME,
    CONSTRAINT "gasto_caja_sesion_id_fkey" FOREIGN KEY ("caja_sesion_id") REFERENCES "caja_sesion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "gasto_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "gasto_usuario_anulacion_id_fkey" FOREIGN KEY ("usuario_anulacion_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "caja_sesion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha_apertura" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_apertura_id" INTEGER NOT NULL,
    "monto_inicial_cents" INTEGER NOT NULL,
    "fecha_cierre" DATETIME,
    "usuario_cierre_id" INTEGER,
    "conteo_declarado_cents" INTEGER,
    "esperado_cents" INTEGER,
    "diferencia_cents" INTEGER,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTA',
    "nota_cierre" TEXT,
    CONSTRAINT "caja_sesion_usuario_apertura_id_fkey" FOREIGN KEY ("usuario_apertura_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "caja_sesion_usuario_cierre_id_fkey" FOREIGN KEY ("usuario_cierre_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "caja_movimiento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caja_sesion_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "monto_cents" INTEGER NOT NULL,
    "venta_id" INTEGER,
    "gasto_id" INTEGER,
    "compra_id" INTEGER,
    "movimiento_cuenta_id" INTEGER,
    "usuario_id" INTEGER NOT NULL,
    "nota" TEXT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "caja_movimiento_caja_sesion_id_fkey" FOREIGN KEY ("caja_sesion_id") REFERENCES "caja_sesion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "caja_movimiento_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "venta" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "caja_movimiento_gasto_id_fkey" FOREIGN KEY ("gasto_id") REFERENCES "gasto" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "caja_movimiento_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "compra" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "caja_movimiento_movimiento_cuenta_id_fkey" FOREIGN KEY ("movimiento_cuenta_id") REFERENCES "movimiento_cuenta" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "caja_movimiento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK ("monto_cents" <> 0)
);

-- CreateTable
CREATE TABLE "movimiento_cuenta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "monto_cents" INTEGER NOT NULL,
    "venta_id" INTEGER,
    "medio_pago_id" INTEGER,
    "usuario_id" INTEGER NOT NULL,
    "nota" TEXT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "movimiento_cuenta_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "movimiento_cuenta_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "venta" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "movimiento_cuenta_medio_pago_id_fkey" FOREIGN KEY ("medio_pago_id") REFERENCES "medio_pago" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "movimiento_cuenta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK ("monto_cents" <> 0)
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER,
    "entidad" TEXT NOT NULL,
    "entidad_id" INTEGER,
    "accion" TEXT NOT NULL,
    "datos_antes" TEXT,
    "datos_despues" TEXT,
    "resumen" TEXT,
    CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contador" (
    "nombre" TEXT NOT NULL PRIMARY KEY,
    "valor" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "parametro" (
    "clave" TEXT NOT NULL PRIMARY KEY,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT
);

-- CreateTable
CREATE TABLE "backup_log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "ruta" TEXT NOT NULL,
    "tamano_bytes" INTEGER,
    "estado" TEXT NOT NULL,
    "mensaje" TEXT,
    "usuario_id" INTEGER,
    CONSTRAINT "backup_log_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usuario_key" ON "usuario"("usuario");

-- CreateIndex
CREATE INDEX "producto_nombre_idx" ON "producto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "codigo_barra_codigo_key" ON "codigo_barra"("codigo");

-- CreateIndex
CREATE INDEX "codigo_barra_producto_id_idx" ON "codigo_barra"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "medio_pago_nombre_key" ON "medio_pago"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "venta_numero_key" ON "venta"("numero");

-- CreateIndex
CREATE INDEX "venta_fecha_idx" ON "venta"("fecha");

-- CreateIndex
CREATE INDEX "venta_caja_sesion_id_idx" ON "venta"("caja_sesion_id");

-- CreateIndex
CREATE INDEX "venta_item_venta_id_idx" ON "venta_item"("venta_id");

-- CreateIndex
CREATE INDEX "venta_item_producto_id_idx" ON "venta_item"("producto_id");

-- CreateIndex
CREATE INDEX "venta_pago_venta_id_idx" ON "venta_pago"("venta_id");

-- CreateIndex
CREATE INDEX "venta_pago_medio_pago_id_idx" ON "venta_pago"("medio_pago_id");

-- CreateIndex
CREATE INDEX "movimiento_stock_producto_id_fecha_idx" ON "movimiento_stock"("producto_id", "fecha");

-- CreateIndex
CREATE INDEX "compra_item_compra_id_idx" ON "compra_item"("compra_id");

-- CreateIndex
CREATE INDEX "compra_item_producto_id_idx" ON "compra_item"("producto_id");

-- CreateIndex
CREATE INDEX "caja_movimiento_caja_sesion_id_idx" ON "caja_movimiento"("caja_sesion_id");

-- CreateIndex
CREATE INDEX "movimiento_cuenta_cliente_id_fecha_idx" ON "movimiento_cuenta"("cliente_id", "fecha");

-- CreateIndex
CREATE INDEX "auditoria_fecha_idx" ON "auditoria"("fecha");

-- CreateIndex
CREATE INDEX "auditoria_entidad_entidad_id_idx" ON "auditoria"("entidad", "entidad_id");

-- CreateIndex (manual: Prisma no expresa índices parciales, ver RN-21)
CREATE UNIQUE INDEX "una_caja_abierta" ON "caja_sesion"("estado") WHERE "estado" = 'ABIERTA';
