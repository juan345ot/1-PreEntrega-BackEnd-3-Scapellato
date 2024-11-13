import express from 'express';
import { generateMockUsers, generateMockPets } from '../utils/generateMocks.js';
import { ErrorHandler } from '../errors/ErrorHandler.js';

const router = express.Router();

router.get('/mockingusers', (req, res, next) => {
    try {
        const mockUsers = generateMockUsers();
        res.json(mockUsers);
    } catch (error) {
        next(new ErrorHandler("USER_VALIDATION_ERROR"));
    }
});

router.get('/mockingpets', (req, res, next) => {
    try {
        const mockPets = generateMockPets();
        res.json(mockPets);
    } catch (error) {
        next(new ErrorHandler("PET_VALIDATION_ERROR"));
    }
});

router.post('/generateData', (req, res, next) => {
    const { users = 50, pets = 100 } = req.body;
    try {
        const mockUsers = generateMockUsers(users);
        const mockPets = generateMockPets(pets);
        // Aquí se guardan los mocks generados
        res.json({ users: mockUsers, pets: mockPets });
    } catch (error) {
        next(new ErrorHandler("DATABASE_ERROR"));
    }
});

export default router;
