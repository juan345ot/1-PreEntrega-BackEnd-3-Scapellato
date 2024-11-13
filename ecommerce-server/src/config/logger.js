import { createLogger, transports, format } from 'winston';

const devFormat = format.combine(
    format.colorize(),
    format.simple()
);

const prodFormat = format.combine(
    format.timestamp(),
    format.json()
);

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
    transports: [
        new transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        }),
        new transports.File({
            filename: 'logs/errors.log',
            level: 'error'
        })
    ]
});

export default logger;
