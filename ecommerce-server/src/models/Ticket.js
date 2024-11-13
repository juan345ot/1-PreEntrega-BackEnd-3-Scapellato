import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true,
        trim: true  // Eliminar espacios en blanco
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'El monto es obligatorio'],
        min: [0, 'El monto no puede ser negativo']  // Validación para evitar montos negativos
    },
    purchaser: {
        type: String,
        required: [true, 'El correo del comprador es obligatorio'],
        lowercase: true,  // Asegurar que se guarde en minúsculas
        trim: true  // Eliminar espacios en blanco
    }
}, {
    timestamps: true  // Agrega createdAt y updatedAt automáticamente
});

// Middleware para generar un código único si no se proporciona
TicketSchema.pre('save', async function(next) {
    if (!this.code) {
        this.code = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }
    next();
});

// Índices para optimizar consultas por comprador
TicketSchema.index({ purchaser: 1 });

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;
