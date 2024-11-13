import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,  // Elimina espacios en blanco adicionales
    maxlength: [100, 'El título no puede exceder los 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,  // Elimina espacios en blanco adicionales
    maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
  },
  code: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']  // Validación para evitar precios negativos
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo']  // Validación para evitar stock negativo
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true
  },
  thumbnails: {
    type: [String],
    default: [],
    validate: {
      validator: function(array) {
        return array.every(url => typeof url === 'string');  // Validación de que todos los elementos sean strings
      },
      message: 'Todas las miniaturas deben ser URLs válidas'
    }
  }
}, {
  timestamps: true  // Agrega createdAt y updatedAt automáticamente
});

// Middleware para normalizar texto antes de guardar
productSchema.pre('save', function(next) {
  this.title = this.title.toLowerCase();
  this.category = this.category.toLowerCase();
  next();
});

// Índices para búsquedas
productSchema.index({ title: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
