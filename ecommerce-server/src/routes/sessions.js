import express from 'express';
import passport from 'passport';
import UserService from '../services/UserService.js';

const router = express.Router();

// Ruta de inicio de sesión
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

// Ruta de logout
router.get('/logout', async (req, res, next) => {
    try {
        req.logout(err => {
            if (err) {
                return next(err);
            }
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al cerrar la sesión', error: err });
                }
                res.clearCookie('connect.sid');  // Elimina la cookie de sesión
                res.redirect('/');
            });
        });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ message: 'Error al cerrar la sesión', error });
    }
});

// Ruta para obtener el usuario actual (segura, con DTO)
router.get('/current', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }

    try {
        // Usamos el DTO para evitar exponer información sensible
        const userDTO = await UserService.getUserDTO(req.user._id);
        if (!userDTO) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(userDTO);
    } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
        res.status(500).json({ message: 'Error al obtener la información del usuario', error: error.message });
    }
});

export default router;
