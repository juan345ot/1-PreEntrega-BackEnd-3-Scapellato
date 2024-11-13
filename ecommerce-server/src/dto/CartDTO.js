class CartDTO {
    constructor(cart) {
        // Destructuring de cart
        const { _id, products = [], user = null } = cart;

        this.id = _id;
        this.products = Array.isArray(products) 
            ? products.map(({ productId, quantity }) => ({ productId, quantity }))
            : [];  // Asegurar que products sea un array antes de mapear

        // Validación de usuario antes de acceder a sus propiedades
        this.user = user ? { id: user._id, email: user.email } : null;
    }
}

export default CartDTO;
