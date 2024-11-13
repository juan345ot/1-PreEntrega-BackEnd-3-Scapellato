import Product from '../models/Product.js';

class ProductRepository {
    // Obtener todos los productos con paginación y filtrado
    static async getAll(query = {}, options = {}) {
        try {
            const filter = query.category ? { category: query.category } : {};
            const products = await Product.find(filter)
                .sort({ price: options.sort === 'desc' ? -1 : 1 })  // Ordenar por precio ascendente o descendente
                .limit(options.limit)
                .skip(options.page * options.limit)
                .lean();  // Utilizar lean() para mejorar la eficiencia
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error.message);
            throw error;
        }
    }

    // Obtener producto por ID
    static async getById(productId) {
        try {
            const product = await Product.findById(productId).lean();
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
    static async create(productData) {
        try {
            const newProduct = await Product.create(productData);
            return newProduct;
        } catch (error) {
            console.error('Error al crear producto:', error.message);
            throw error;
        }
    }

    // Actualizar un producto existente
    static async update(productId, updateData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
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
    static async delete(productId) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado para eliminar');
            }
            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            throw error;
        }
    }

    // Verificación de stock
    static async checkStock(productId, quantity) {
        try {
            const product = await Product.findById(productId).lean();
            if (!product) {
                throw new Error('Producto no encontrado para verificar stock');
            }
            return product.stock >= quantity;
        } catch (error) {
            console.error('Error al verificar el stock del producto:', error.message);
            throw error;
        }
    }

    // Reducir stock de un producto
    static async reduceStock(productId, quantity) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
            if (!updatedProduct) {
                throw new Error('Producto no encontrado para reducir stock');
            }
            return updatedProduct;
        } catch (error) {
            console.error('Error al reducir stock del producto:', error.message);
            throw error;
        }
    }
}

export default ProductRepository;
