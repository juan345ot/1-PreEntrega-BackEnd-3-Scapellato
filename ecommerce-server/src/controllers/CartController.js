import CartService from '../services/CartService.js';

class CartController {
    // Obtener un carrito por ID
    static async getCart(req, res) {
        const { cid } = req.params;
        try {
            if (!cid) {
                return res.status(400).json({ error: 'ID de carrito no proporcionado' });
            }
            const cart = await CartService.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            res.status(500).json({ error: 'Error al obtener el carrito', details: error.message });
        }
    }

    // Añadir un producto al carrito
    static async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            if (!cid || !pid) {
                return res.status(400).json({ error: 'ID de carrito o producto no proporcionado' });
            }
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ error: 'Cantidad no válida' });
            }

            const updatedCart = await CartService.addProductToCart(cid, pid, quantity);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito o producto no encontrado' });
            }

            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({ error: 'Error al agregar producto al carrito', details: error.message });
        }
    }

    // Procesar la compra del carrito
    static async purchaseCart(req, res) {
        const { cid } = req.params;

        try {
            if (!cid) {
                return res.status(400).json({ error: 'ID de carrito no proporcionado' });
            }

            const result = await CartService.purchaseCart(cid);
            if (!result) {
                return res.status(404).json({ error: 'Carrito no encontrado o sin productos disponibles' });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error al procesar la compra del carrito:', error);
            res.status(500).json({ error: 'Error al procesar la compra', details: error.message });
        }
    }
}

export default CartController;
