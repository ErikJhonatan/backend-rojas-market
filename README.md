# Rojas Market · Backend de aprendizaje

Backend Express y Sequelize para productos, categorías, clientes y pedidos; fork del curso de Node.js de Platzi.

## Origen y alcance

Este repositorio es un fork de [platzi/curso-nodejs-postgres](https://github.com/platzi/curso-nodejs-postgres). Conserva la atribución al proyecto original y no se presenta como una implementación íntegramente propia.

La versión actual declara Express, Sequelize y el driver `mysql2`. Contiene rutas de autenticación, usuarios, categorías, clientes, productos y pedidos, además de modelos y migraciones.

## Desarrollo

Los scripts disponibles en `package.json` incluyen `npm run dev`, `npm start` y comandos de migración. Configura tus propias variables de entorno y una base de datos de desarrollo antes de ejecutar operaciones de persistencia. El campo `engines` conserva Node 14 del proyecto histórico y requiere revisión para un entorno actual.

Frontend relacionado: [frontend-rojas-market](https://github.com/ErikJhonatan/frontend-rojas-market). La integración entre ambos no se ha ejecutado durante esta revisión.

## Cambios de comportamiento

`POST /api/v1/orders` acepta `{customerId, items: [{productId, amount}]}` además del formato anterior sin items; conserva la respuesta `{newOrder}`. El pedido completo y el stock se escriben en una transacción. Los clientes acceden a sus propios pedidos y datos; el rol admin gestiona los demás. Usuarios y estadísticas requieren admin. Se habilitan PATCH y DELETE de pedidos ya usados por el POS. Las respuestas con usuarios excluyen contraseñas.
