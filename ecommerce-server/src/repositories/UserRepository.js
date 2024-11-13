import User from '../models/User.js';

class UserRepository {
    // Obtener usuario por ID
    static async getById(userId) {
        try {
            const user = await User.findById(userId).lean();  // Usar lean() para mejorar la eficiencia
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error.message);
            throw error;
        }
    }

    // Crear un nuevo usuario
    static async create(userData) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            console.error('Error al crear usuario:', error.message);
            throw error;
        }
    }

    // Actualizar un usuario existente
    static async update(userId, updateData) {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
            if (!updatedUser) {
                throw new Error('Usuario no encontrado para actualizar');
            }
            return updatedUser;
        } catch (error) {
            console.error('Error al actualizar usuario:', error.message);
            throw error;
        }
    }

    // Eliminar un usuario por ID
    static async delete(userId) {
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser) {
                throw new Error('Usuario no encontrado para eliminar');
            }
            return deletedUser;
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
            throw error;
        }
    }

    // Obtener usuario por email
    static async getByEmail(email) {
        try {
            const user = await User.findOne({ email }).lean();
            if (!user) {
                throw new Error('Usuario no encontrado por correo electrónico');
            }
            return user;
        } catch (error) {
            console.error('Error al obtener usuario por email:', error.message);
            throw error;
        }
    }
}

export default UserRepository;
