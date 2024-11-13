import ProductRepository from '../repositories/ProductRepository.js';

class ProductService {
    // Obtener todos los productos con opciones de paginación y filtrado
    static async getAllProducts(query = {}, options = {}) {
        try {
            const products = await ProductRepository.getAll(query, options);
            if (!products || products.length === 0) {
                throw new Error('No se encontraron productos');
            }
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error.message);
            throw error;
        }
    }

    // Obtener un producto por ID
    static async getProductById(productId) {
        try {
            const product = await ProductRepository.getById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            throw error;
        }
    }

    // Crear un nuevo producto
    static async createProduct(productData) {
        try {
            const newProduct = await ProductRepository.create(productData);
            return newProduct;
        } catch (error) {
            console.error('Error al crear producto:', error.message);
            throw error;
        }
    }

    // Actualizar un producto existente
    static async updateProduct(productId, updateData) {
        try {
            const updatedProduct = await ProductRepository.update(productId, updateData);
            if (!updatedProduct) {
                throw new Error('Producto no encontrado para actualizar');
            }
            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            throw error;
        }
    }

    // Eliminar un producto por ID
    static async deleteProduct(productId) {
        try {
            const deletedProduct = await ProductRepository.delete(productId);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado para eliminar');
            }
            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            throw error;
        }
    }

    // Verificar stock de un producto
    static async checkProductStock(productId, quantity) {
        try {
            const hasStock = await ProductRepository.checkStock(productId, quantity);
            if (!hasStock) {
                throw new Error('Stock insuficiente para el producto');
            }
            return hasStock;
        } catch (error) {
            console.error('Error al verificar stock del producto:', error.message);
            throw error;
        }
    }

    // Reducir stock de un producto
    static async reduceProductStock(productId, quantity) {
        try {
            const reducedStock = await ProductRepository.reduceStock(productId, quantity);
            if (!reducedStock) {
                throw new Error('No se pudo reducir el stock del producto');
            }
            return reducedStock;
        } catch (error) {
            console.error('Error al reducir stock del producto:', error.message);
            throw error;
        }
    }
}

export default ProductService;
