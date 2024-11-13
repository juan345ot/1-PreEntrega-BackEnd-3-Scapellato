import ProductService from '../services/ProductService.js';

class ProductController {
    // Obtener todos los productos
    static async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            if (!products || products.length === 0) {
                return res.status(404).json({ error: 'No se encontraron productos' });
            }
            res.status(200).json(products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ error: 'Error al obtener productos', details: error.message });
        }
    }

    // Obtener un producto por ID
    static async getProductById(req, res) {
        const { pid } = req.params;
        try {
            if (!pid) {
                return res.status(400).json({ error: 'ID de producto no proporcionado' });
            }
            const product = await ProductService.getProductById(pid);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({ error: 'Error al obtener producto', details: error.message });
        }
    }

    // Crear un producto (solo admin)
    static async createProduct(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        const productData = req.body;
        try {
            if (!productData || Object.keys(productData).length === 0) {
                return res.status(400).json({ error: 'Datos de producto no proporcionados' });
            }
            const newProduct = await ProductService.createProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({ error: 'Error al crear producto', details: error.message });
        }
    }

    // Actualizar un producto por ID (solo admin)
    static async updateProduct(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        const { pid } = req.params;
        const updateData = req.body;
        try {
            if (!pid) {
                return res.status(400).json({ error: 'ID de producto no proporcionado' });
            }
            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'Datos de actualización no proporcionados' });
            }
            const updatedProduct = await ProductService.updateProduct(pid, updateData);
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({ error: 'Error al actualizar producto', details: error.message });
        }
    }

    // Eliminar un producto por ID (solo admin)
    static async deleteProduct(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        const { pid } = req.params;
        try {
            if (!pid) {
                return res.status(400).json({ error: 'ID de producto no proporcionado' });
            }
            const deleted = await ProductService.deleteProduct(pid);
            if (!deleted) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json({ message: 'Producto eliminado' });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({ error: 'Error al eliminar producto', details: error.message });
        }
    }
}

export default ProductController;
