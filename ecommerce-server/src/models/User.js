import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  last_name: { 
    type: String, 
    required: [true, 'El apellido es obligatorio'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true,  // Asegura que el email esté en minúsculas
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'El correo electrónico no es válido']  // Validación de formato de correo
  },
  age: { 
    type: Number, 
    required: [true, 'La edad es obligatoria'],
    min: [0, 'La edad no puede ser negativa'] 
  },
  password: { 
    type: String, 
    required: [true, 'La contraseña es obligatoria']
  },
  cart: { 
    type: Schema.Types.ObjectId, 
    ref: 'Cart' 
  },
  role: { 
    type: String, 
    default: 'user',
    enum: ['user', 'admin'],  // Se asegura que el rol sea 'user' o 'admin'
    index: true  // Añade un índice en el campo 'role'
  }
}, {
  timestamps: true  // Agrega createdAt y updatedAt automáticamente
});

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();  // Si la contraseña no ha sido modificada, no encriptar

  try {
    const salt = await bcrypt.genSalt(10);  // Genera un salt para la encriptación
    this.password = await bcrypt.hash(this.password, salt);  // Encripta la contraseña
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas al iniciar sesión
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
