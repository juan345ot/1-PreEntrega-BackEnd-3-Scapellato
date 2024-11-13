import Cart from '../models/Cart.js';

class CartRepository {
    // Obtener un carrito por ID con los productos poblados
    static async getById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error.message);
            throw error;  // Re-lanzar el error para que lo maneje la capa superior
        }
    }

    // Crear un nuevo carrito
    static async create(cartData) {
        try {
            const newCart = await Cart.create(cartData);
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error.message);
            throw error;
        }
    }

    // Actualizar un carrito existente
    static async update(cartId, updateData) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
            if (!updatedCart) {
                throw new Error('Carrito no encontrado para actualizar');
            }
            return updatedCart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error.message);
            throw error;
        }
    }

    // Eliminar un carrito por ID
    static async delete(cartId) {
        try {
            const deletedCart = await Cart.findByIdAndDelete(cartId);
            if (!deletedCart) {
                throw new Error('Carrito no encontrado para eliminar');
            }
            return deletedCart;
        } catch (error) {
            console.error('Error al eliminar el carrito:', error.message);
            throw error;
        }
    }

    // Actualizar los productos en un carrito
    static async updateCartProducts(cartId, products) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
            if (!updatedCart) {
                throw new Error('Carrito no encontrado para actualizar productos');
            }
            return updatedCart;
        } catch (error) {
            console.error('Error al actualizar los productos del carrito:', error.message);
            throw error;
        }
    }
}

export default CartRepository;
