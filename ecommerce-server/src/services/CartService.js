import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import TicketRepository from '../repositories/TicketRepository.js';
import CartDTO from '../dto/CartDTO.js';
import ProductDTO from '../dto/ProductDTO.js';
import { v4 as uuidv4 } from 'uuid';

class CartService {
    // Obtener un carrito por ID y devolver su DTO
    static async getCartById(cartId) {
        try {
            const cart = await CartRepository.getById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return new CartDTO(cart);
        } catch (error) {
            console.error('Error al obtener el carrito:', error.message);
            throw error;
        }
    }

    // Agregar un producto al carrito
    static async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await CartRepository.getById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const product = await ProductRepository.getById(productId);
            if (!product || product.stock < quantity) {
                throw new Error('Producto no disponible en la cantidad solicitada');
            }

            const productInCart = cart.products.find(item => item.productId.toString() === productId);
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            await ProductRepository.reduceStock(productId, quantity);
            const updatedCart = await CartRepository.updateCartProducts(cartId, cart.products);
            return new CartDTO(updatedCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error.message);
            throw error;
        }
    }

    // Finalizar la compra de un carrito
    static async purchaseCart(cartId) {
        try {
            const cart = await CartRepository.getById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            let totalAmount = 0;
            const unavailableProducts = [];

            // Verificar el stock y calcular el total en paralelo
            await Promise.all(cart.products.map(async (item) => {
                const product = await ProductRepository.getById(item.productId);
                if (product && product.stock >= item.quantity) {
                    totalAmount += product.price * item.quantity;
                    await ProductRepository.reduceStock(item.productId, item.quantity);
                } else {
                    unavailableProducts.push({ productId: item.productId, name: product?.name || 'Producto desconocido' });
                }
            }));

            // Si hay productos no disponibles, retornamos con esa información
            if (unavailableProducts.length > 0) {
                return {
                    message: 'Algunos productos no están disponibles',
                    unavailableProducts: unavailableProducts.map(p => new ProductDTO(p)),
                };
            }

            // Generar un ticket si hay monto total
            if (totalAmount > 0) {
                const ticket = {
                    code: uuidv4(),
                    purchase_datetime: new Date(),
                    amount: totalAmount,
                    purchaser: cart.user.email,
                };
                await TicketRepository.create(ticket);
            }

            // Filtrar los productos que no tenían stock disponible
            cart.products = cart.products.filter(item => !unavailableProducts.some(unp => unp.productId === item.productId));
            const updatedCart = await CartRepository.updateCartProducts(cartId, cart.products);

            return { message: 'Compra realizada con éxito', cart: new CartDTO(updatedCart) };
        } catch (error) {
            console.error('Error al finalizar la compra del carrito:', error.message);
            throw error;
        }
    }
}

export default CartService;
