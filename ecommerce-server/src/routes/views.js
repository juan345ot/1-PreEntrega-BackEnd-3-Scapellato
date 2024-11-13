import express from 'express';
import ProductService from '../services/ProductService.js';
import CartService from '../services/CartService.js';

const router = express.Router();

// Ruta para la página principal
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const options = {
            limit: parseInt(limit) || 10,
            page: parseInt(page) || 0,
            sort: sort === 'desc' ? 'desc' : 'asc', // Validación del valor de sort
        };

        const products = await ProductService.getAllProducts(query, options);
        if (!products || products.length === 0) {
            return res.status(404).render('home', { message: 'No se encontraron productos.' });
        }

        res.render('home', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ message: 'Error al obtener productos', details: error.message });
    }
});

// Ruta para ver un carrito específico
router.get('/cart/:id', async (req, res) => {
    try {
        const cart = await CartService.getCartById(req.params.id);

        if (!cart) {
            return res.status(404).render('cart', { message: 'Carrito no encontrado.' });
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error.message);
        res.status(500).json({ message: 'Error al obtener el carrito', details: error.message });
    }
});

export default router;
