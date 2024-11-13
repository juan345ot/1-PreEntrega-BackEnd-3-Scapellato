import { errorDictionary } from './errorDictionary.js';

class ErrorHandler extends Error {
    constructor(errorType) {
        super();
        const errorInfo = errorDictionary[errorType] || {
            statusCode: 500,
            message: "Error inesperado"
        };
        this.statusCode = errorInfo.statusCode;
        this.message = errorInfo.message;
    }
}

const handleError = (err, req, res, next) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        status: "error",
        statusCode,
        message
    });
};

export { ErrorHandler, handleError };
