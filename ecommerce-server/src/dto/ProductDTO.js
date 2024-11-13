class ProductDTO {
    constructor(product) {
        const { _id, name, price, stock } = product;

        this.id = _id;
        this.name = name || 'Nombre no disponible';
        this.price = price || 0;  // Precio por defecto 0 si no está disponible
        this.stock = stock || 0;  // Stock por defecto 0 si no está disponible
    }
}

export default ProductDTO;
