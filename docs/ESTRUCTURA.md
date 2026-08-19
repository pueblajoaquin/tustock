### Decisiones estructurales

#### Capas (Routes / Controller / Service) — **base**

- **Problema que resuelve:** todo total lo calcula el servidor y esta logica no esta repartida entre otros modulos
- Tres archivos por cada módulo (service/controller/routes), más `core/` para el cálculo puro.
- El `service` habla con Prisma directo.
- Todo lo que es cálculo, subtotal, total, comisión, vuelto, signo del movimiento, redondeo, etc, vive en `core/calculos.js` y se testea aparte. El service queda como orquestador: valida, calcula llamando a `core`, arma la transacción, guarda.

#### Objeto de contexto

- RN-34 pide que toda operación sensible registre quién la hizo. Si el `usuarioId` no viaja hasta el servicio, la auditoría se convierte en algo que te acordás de poner a veces.
- Mi Solución: el middleware de autenticación arma `req.contexto = { usuarioId, rol }` y todo método de servicio lo recibe como primer parámetro. Que sea obligatorio en la firma hace que sea imposible de olvidar.
