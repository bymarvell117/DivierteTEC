# Modelo de negocio de DivierteTEC — "Crece con tu estudio"

DivierteTEC necesita dinero para servidores, moderación y eventos, pero su público
son estudiantes que publican su primer juego. Por eso el modelo tiene dos reglas:

1. **Que publicar no cueste nada.** Los estudios estudiantiles no pagan comisión
   hasta que su juego empieza a vender en serio.
2. **Que el dinero de los jugadores llegue a los creadores.** La plataforma cobra
   menos que las tiendas grandes y reparte la mayor parte del Pase entre los estudios.

Todo está implementado en la demo con **dinero simulado** (`js/economy.js`): no se piden
ni guardan datos bancarios. Las tasas se cambian en *Admin → Finanzas*.

## 1. Fuentes de ingreso

| Fuente | Quién paga | Cuánto | Qué recibe la plataforma |
|---|---|---|---|
| Venta de juegos | Jugador | Precio fijado por el estudio | Comisión escalonada (abajo) |
| Pase DivierteTEC | Jugador | $59 MXN / mes | 30 % (el 70 % va al fondo de estudios) |
| Destacado patrocinado | Estudio | $150 MXN / 7 días | 100 % |
| Propinas | Jugador | Libre ($10–$100) | 0 % en la demo (5 % propuesto en producción) |
| Licencias institucionales | Tecnológicos, universidades | Por convenio | Instancia propia para Hackatecs y cursos |
| Patrocinio de torneos | Empresas | Por evento | Marca en torneos y premios |

### Comisión escalonada por venta

| Tramo | Aplica a | Comisión | El estudio recibe |
|---|---|---|---|
| **Semilla TEC** | Primeros $2,000 MXN de ventas de un estudio estudiantil verificado | **0 %** | 100 % |
| Estudiantil | Estudios estudiantiles verificados, después de la Semilla | **12 %** | 88 % |
| Externo | Estudios independientes o empresas | **18 %** | 82 % |

Referencia de mercado: Steam cobra 30 % en su tramo estándar, Epic Games Store 12 %
e itch.io deja que el estudio elija (10 % por defecto). DivierteTEC queda en la parte
baja del mercado y con un tramo gratis para quien empieza.

### Modalidades de precio para el estudio
- **Paga lo que quieras (pilar de la plataforma).** En DivierteTEC no hay juegos
  "gratis" a secas: todo juego gratuito usa *Paga lo que quieras* con mínimo $0 y un
  precio sugerido. Se juega al instante sin pagar; quien quiera aporta la cantidad que
  elija y el aporte se trata como una venta (misma comisión escalonada, Semilla TEC
  incluida). Al cerrar un juego tras 5 minutos se invita, sin insistir, a apoyar al
  estudio. El estudio también puede fijar un mínimo mayor que $0.
- **Precio fijo**, con **descuentos temporales** (ej. −30 %).
- **Incluir en el Pase** (compatible con cualquiera de las anteriores).

Por qué: convierte a cada jugador satisfecho en un posible mecenas del talento
mexicano sin poner barreras para probar los juegos, que es lo que más necesita un
estudio estudiantil que empieza.

## 2. Pase DivierteTEC

- $59 MXN al mes. Incluye los juegos marcados "Incluido en el Pase", 10 % de descuento
  en juegos de pago y la insignia *Miembro del Pase*.
- **Fondo de estudios:** el 70 % de cada suscripción entra a un fondo. Cada mes la
  administración lo reparte entre los estudios con juegos en el Pase, **proporcional al
  tiempo jugado** (*Admin → Finanzas → Repartir por tiempo jugado*).
- Si el Pase vence, los juegos siguen en la biblioteca pero piden renovar o comprar.

## 3. Flujo del dinero (ejemplo con $100 MXN)

```
Venta a un estudio estudiantil (después de la Semilla):
  Jugador paga $100 ──► Estudio $88 ──► DivierteTEC $12

Suscripción al Pase:
  Jugador paga $59 ──► Fondo de estudios $41.30 (reparto por tiempo jugado)
                  └──► DivierteTEC $17.70
```

## 4. Proyección sencilla (supuestos, no datos reales)

Escenario mensual con **500 jugadores activos** y **30 estudios**:

| Concepto | Supuesto | Ingreso de la plataforma |
|---|---|---|
| Pase | 15 % se suscribe → 75 × $59 = $4,425 | 30 % = **$1,327** |
| Ventas | 300 copias × $40 promedio = $12,000 | ~13 % promedio (con Semilla) = **$1,560** |
| Destacados | 6 promociones × $150 | **$900** |
| **Total** | | **≈ $3,790 MXN / mes** |

Además, los estudios reciben ≈ $10,440 de ventas y ≈ $3,100 del fondo del Pase.
Costos a cubrir: alojamiento (hosting estático + backend pequeño), comisión del
procesador de pagos (≈ 3–4 % por transacción según el proveedor) y moderación.
Las licencias institucionales y el patrocinio de torneos quedan como ingreso adicional.

## 5. Cómo se ve en la demo

| Rol | Dónde |
|---|---|
| Jugador | Monedero en la barra superior (saldo, recarga de demostración, movimientos) · botón **Comprar** con desglose de lo que recibe el estudio · **Paga lo que quieras** · **Apoyar al estudio** (propina) · página **PASE** (`#/planes`) con calculadora |
| Desarrollador | Pestaña **Precio y ventas** de cada juego: modalidad, descuento, Pase, vista previa de lo que recibe por copia, progreso de la Semilla TEC, ventas y **Destacado patrocinado** |
| Administrador | **Finanzas**: ingresos por fuente, pagado a estudios, suscriptores, reparto del fondo del Pase, aprobación de promociones, tasas editables y libro de transacciones. En *Usuarios* se marca un estudio como estudiantil o externo |

## 6. Camino a producción

1. Backend con base de datos y cuentas reales (el estado hoy vive en el navegador).
2. Procesador de pagos mexicano o internacional (Mercado Pago, Stripe, Conekta) con
   pagos con tarjeta, OXXO y SPEI; la plataforma nunca guarda datos de tarjeta.
3. Verificación de estudios estudiantiles con correo institucional.
4. Pagos a estudios por transferencia con mínimo de retiro y facturación.
5. Reportes fiscales y términos de servicio.
