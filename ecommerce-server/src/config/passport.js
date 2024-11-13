import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Estrategia de autenticación local (login con email y contraseña)
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    const isMatch = await bcrypt.compare(password, user.password); // Usar compare asíncrono
    if (!isMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    return done(null, user);
  } catch (error) {
    console.error('Error en la estrategia local:', error); // Agregar más detalles en caso de error
    return done(error);
  }
}));

// Opciones de la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET  // Asegurar que JWT_SECRET esté presente en el archivo .env
};

// Estrategia de autenticación JWT
passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id).exec(); // Agregamos exec() para asegurar la ejecución de la consulta
    if (user) {
      return done(null, user);
    }
    return done(null, false, { message: 'Usuario no encontrado' });
  } catch (error) {
    console.error('Error en la estrategia JWT:', error); // Mejor manejo de errores
    return done(error, false);
  }
}));

// Serialización del usuario (almacena el id del usuario en la sesión)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialización del usuario (recupera los detalles del usuario con el id almacenado en la sesión)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec(); // Agregamos exec() para mejorar el rendimiento
    done(null, user);
  } catch (error) {
    console.error('Error al deserializar usuario:', error); // Manejo mejorado de errores
    done(error);
  }
});
