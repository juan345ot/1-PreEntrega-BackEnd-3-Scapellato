import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import logger from './src/config/logger.js'; // Logger configurado con Winston
import { handleError } from './src/errors/ErrorHandler.js'; // Manejador de errores personalizado

// Importar rutas
import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';
import sessionRoutes from './routes/sessions.js';
import viewRoutes from './routes/views.js';
import mockRoutes from './src/mocks/mocks.router.js'; // Rutas para mocking

// Configurar dotenv para cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de conexión a MongoDB con logging
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => {
        logger.info('Conectado a la base de datos');
    })
    .catch((error) => {
        logger.error('Error conectando a la base de datos', error);
    });

mongoose.connection.on('disconnected', () => {
    logger.warn('Conexión a MongoDB perdida');
});
mongoose.connection.on('reconnected', () => {
    logger.info('Reconexion a MongoDB');
});

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());
import './config/passport.js'; // Importar configuración de Passport

// Configurar el motor de plantillas Handlebars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('handlebars', engine({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'index',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Helpers de Handlebars en un archivo separado (por modularidad)
Handlebars.registerHelper('range', function(n, options) {
    let accum = '';
    for (let i = 1; i <= n; ++i) {
        accum += '<li>Elemento número ' + i + '</li>';
    }
    return accum;
});

Handlebars.registerHelper('gt', function(a, b, options) {
    if (typeof options.inverse !== 'function') {
        options.inverse = () => '';
    }
    return a > b ? options.fn(this) : options.inverse(this);
});

// Middleware para procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/', viewRoutes);
app.use('/api/mocks', mockRoutes); // Nueva ruta para mocking
app.get('/loggerTest', (req, res) => {
    logger.debug("Debug log");
    logger.http("HTTP log");
    logger.info("Info log");
    logger.warn("Warning log");
    logger.error("Error log");
    logger.log('fatal', "Fatal log"); // Para el nivel 'fatal' personalizado

    res.send("Logs generados en distintos niveles.");
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).render('404', { message: 'Página no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    logger.error(err.stack);
    handleError(err, req, res, next); // Usar el manejador de errores personalizado
});

// Iniciar el servidor
app.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${PORT}`);
});
