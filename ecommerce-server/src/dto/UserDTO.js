class UserDTO {
    constructor(user) {
        const { _id, name, email, role } = user;

        this.id = _id;
        this.name = name || 'Nombre no disponible';  // Nombre por defecto
        this.email = email || 'Correo no disponible';  // Email por defecto
        this.role = role || 'usuario';  // Rol por defecto como 'usuario'
    }
}

export default UserDTO;
