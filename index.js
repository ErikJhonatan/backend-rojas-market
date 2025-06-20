const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { config } = require('./config/config');
const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const { checkApiKey } = require('./middlewares/auth.handler');

const app = express();

// Configuración CORS restrictiva
app.use(cors({
  origin: [config.corsOrigin, 'https://cloud.erikjhonatan.dev'],
  credentials: true
}));
app.use(express.json());

require('./utils/auth');
app.get('/', (req, res) => {
  res.send('Hola mi server en express');
});

app.get('/nueva-ruta',
  checkApiKey,
  (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(ormErrorHandler);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Mi port' +  port);
});
