// Middleware dinámico para autorizar según el rol
export const authorizeRole = (requiredRole) => (req, res, next) => {
    const user = req.user;

    // Verificar si el usuario está autenticado
    if (!user) {
        return res.status(401).json({ message: 'No autenticado. Inicie sesión.' });
    }

    // Verificar si el rol del usuario coincide con el rol requerido
    if (user.role !== requiredRole) {
        return res.status(403).json({ message: `Acceso denegado. Solo para ${requiredRole}s.` });
    }

    next();  // Continuar si el rol es válido
};

// Middleware específico para admins
export const authorizeAdmin = authorizeRole('admin');

// Middleware específico para usuarios
export const authorizeUser = authorizeRole('user');
