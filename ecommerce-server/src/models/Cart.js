import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: [1, 'La cantidad mínima es 1'],  // Validación de cantidad mínima
      }
    }
  ]
}, {
  timestamps: true  // Agrega createdAt y updatedAt automáticamente
});

// Población automática de productos al obtener un carrito
cartSchema.pre(/^find/, function(next) {
  this.populate('products.product');
  next();
});

// Añadimos un índice en product para optimizar las consultas
cartSchema.index({ 'products.product': 1 });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
