const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { config } = require('./config/config');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/error.handler');
const { checkApiKey } = require('./middlewares/auth.handler');

const app = express();

// Configuración CORS más robusta
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (aplicaciones móviles, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      config.corsOrigin,
      'https://cloud.erikjhonatan.dev',
      'http://localhost:5173', // Para desarrollo local
      'http://localhost:3000',
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware adicional para manejar preflight requests
app.options('*', cors(corsOptions));

require('./utils/auth');
app.get('/', (req, res) => {
  res.send('Hola mi server en express');
});

app.get('/nueva-ruta', checkApiKey, (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(ormErrorHandler);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Mi port' + port);
});
