import Ticket from '../models/Ticket.js';

class TicketRepository {
    // Crear un nuevo ticket
    static async create(ticketData) {
        try {
            const newTicket = await Ticket.create(ticketData);
            return newTicket;
        } catch (error) {
            console.error('Error al crear el ticket:', error.message);
            throw error;  // Re-lanzar el error para que lo maneje la capa superior
        }
    }

    // Obtener un ticket por ID
    static async getById(ticketId) {
        try {
            const ticket = await Ticket.findById(ticketId).lean();  // Utilizar lean() para optimizar la consulta
            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }
            return ticket;
        } catch (error) {
            console.error('Error al obtener el ticket por ID:', error.message);
            throw error;
        }
    }
}

export default TicketRepository;
