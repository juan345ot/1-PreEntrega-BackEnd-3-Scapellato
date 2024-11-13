import UserService from '../services/UserService.js';

class UserController {
    // Obtener información del usuario actual
    static async getCurrentUser(req, res) {
        try {
            const { id: userId } = req.user || {};
            if (!userId) {
                return res.status(400).json({ error: 'ID de usuario no proporcionado' });
            }

            const userDTO = await UserService.getUserDTO(userId);
            if (!userDTO) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json(userDTO);
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error.message);
            res.status(500).json({ error: 'Error al obtener la información del usuario', details: error.message });
        }
    }

    // Actualizar información del usuario
    static async updateUser(req, res) {
        try {
            const { id } = req.user;
            const updateData = req.body;

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'Datos de actualización no proporcionados' });
            }

            const updatedUser = await UserService.updateUser(id, updateData);
            if (!updatedUser) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error al actualizar usuario:', error.message);
            res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
        }
    }
}

export default UserController;
