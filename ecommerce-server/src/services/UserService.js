import UserRepository from '../repositories/UserRepository.js';
import UserDTO from '../dto/UserDTO.js';

class UserService {
    // Obtener el DTO de un usuario por ID
    static async getUserDTO(userId) {
        try {
            const user = await UserRepository.getById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return new UserDTO(user);
        } catch (error) {
            console.error('Error al obtener el usuario por ID:', error.message);
            throw error;  // Re-lanzamos el error para ser manejado en capas superiores
        }
    }

    // Obtener el DTO de un usuario por email
    static async getUserByEmail(email) {
        try {
            const user = await UserRepository.getByEmail(email);
            if (!user) {
                throw new Error('Usuario no encontrado con el email proporcionado');
            }
            return new UserDTO(user);
        } catch (error) {
            console.error('Error al obtener el usuario por email:', error.message);
            throw error;
        }
    }

    // Actualizar un usuario
    static async updateUser(userId, updateData) {
        try {
            const updatedUser = await UserRepository.update(userId, updateData);
            if (!updatedUser) {
                throw new Error('Usuario no encontrado para actualizar');
            }
            return updatedUser;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error.message);
            throw error;
        }
    }
}

export default UserService;
