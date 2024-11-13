import express from 'express';
import ProductService from '../services/ProductService.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener todos los productos con paginación, filtrado y ordenación
router.get('/', async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 0,
        sort: sort === 'desc' ? 'desc' : 'asc',  // Validar el valor de sort
    };

    try {
        const products = await ProductService.getAllProducts(query, options);
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ message: 'Error al obtener productos', details: error.message });
    }
});

// Crear un nuevo producto (solo administradores)
router.post('/', authorizeAdmin, async (req, res) => {
    try {
        const product = await ProductService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        res.status(500).json({ message: 'Error al crear producto', details: error.message });
    }
});

// Actualizar un producto existente (solo administradores)
router.put('/:id', authorizeAdmin, async (req, res) => {
    try {
        const product = await ProductService.updateProduct(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        res.status(500).json({ message: 'Error al actualizar producto', details: error.message });
    }
});

// Eliminar un producto (solo administradores)
router.delete('/:id', authorizeAdmin, async (req, res) => {
    try {
        const deletedProduct = await ProductService.deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(204).end();  // Eliminar correctamente, 204 no tiene contenido
    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        res.status(500).json({ message: 'Error al eliminar producto', details: error.message });
    }
});

export default router;
