export const errorDictionary = {
    USER_NOT_FOUND: {
        statusCode: 404,
        message: "Usuario no encontrado"
    },
    PET_NOT_FOUND: {
        statusCode: 404,
        message: "Mascota no encontrada"
    },
    USER_VALIDATION_ERROR: {
        statusCode: 400,
        message: "Datos del usuario no válidos"
    },
    PET_VALIDATION_ERROR: {
        statusCode: 400,
        message: "Datos de la mascota no válidos"
    },
    DATABASE_ERROR: {
        statusCode: 500,
        message: "Error al conectar con la base de datos"
    }
};
