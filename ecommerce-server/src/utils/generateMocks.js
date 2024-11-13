const faker = require('faker');
const bcrypt = require('bcrypt');

const generateMockUsers = (numUsers = 50) => {
    return Array.from({ length: numUsers }, () => ({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('coder123', 10),
        role: Math.random() > 0.5 ? 'admin' : 'user',
        pets: []
    }));
};

const generateMockPets = (numPets = 100) => {
    return Array.from({ length: numPets }, () => ({
        name: faker.name.firstName(),
        type: faker.animal.type(),
        adopted: false,
        owner: null
    }));
};

module.exports = { generateMockUsers, generateMockPets };
