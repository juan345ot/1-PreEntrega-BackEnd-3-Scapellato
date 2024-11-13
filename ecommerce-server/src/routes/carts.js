import express from 'express';
import CartService from '../services/CartService.js';
import { authorizeUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener carrito por ID
router.get('/:id', async (req, res) => {
    try {
        const cart = await CartService.getCartById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', details: error.message });
    }
});

// Agregar productos al carrito (solo usuarios)
router.post('/:id/products', authorizeUser, async (req, res) => {
    const { productId, quantity } = req.body;

    // Validación básica
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Datos de producto inválidos: se requiere productId y quantity mayor que 0' });
    }

    try {
        const cart = await CartService.addProductToCart(req.params.id, productId, quantity);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.status(201).json(cart); // 201 indica creación o modificación exitosa
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito', details: error.message });
    }
});

// Finalizar la compra del carrito (solo usuarios)
router.post('/:id/purchase', authorizeUser, async (req, res) => {
    try {
        const result = await CartService.purchaseCart(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Carrito no encontrado o compra fallida' });
        }
        res.json(result);
    } catch (error) {
        console.error('Error al finalizar la compra del carrito:', error);
        res.status(500).json({ message: 'Error al finalizar la compra', details: error.message });
    }
});

export default router;
