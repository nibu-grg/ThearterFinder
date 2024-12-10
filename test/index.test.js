const request = require('supertest');
const { app, server } = require('../index.js');
const mysql = require('mysql2');

jest.mock('mysql2', () => ({
    createConnection: jest.fn().mockReturnValue({
        connect: jest.fn((callback) => callback(null)),
        query: jest.fn().mockImplementation((query, values, callback) => {
            if (query.includes("INSERT INTO Theater")) {
                callback(null, { insertId: 1 });
            } else if (query.includes("DELETE FROM Theater WHERE Theater_Id = ?")) {
                const theaterId = values[0];
                if (theaterId === 1) {
                    callback(null, { affectedRows: 1 });
                } else {
                    callback(null, { affectedRows: 0 });
                }
            } else if (query.includes("SELECT * FROM Theater")) {
                callback(null, [
                    { Theater_ID: 1, Theater_Name: 'Theater 1', Location: 'Dublin', City: 'Dublin', EirCode: 'D02AX23', Mobile: 1234567890, Email: 'theater1@example.com' },
                    { Theater_ID: 2, Theater_Name: 'Theater 2', Location: 'Cork', City: 'Cork', EirCode: 'C03BY45', Mobile: 9876543210, Email: 'theater2@example.com' }
                ]);
            } else {
                callback(new Error(`Unhandled query: ${query}`));
            }
        }),
        end: jest.fn(),
    }),
}));

afterAll(() => {
    if (server) {
        server.close();
    }
});

describe('POST /addTheater', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new theater', async () => {
        const newTheater = {
            Theater_Name: 'New Theater',
            Location: 'Dublin',
            City: 'City Center',
            EirCode: 'D02AX23',
            Mobile: 1234567890,
            Email: 'newtheater@example.com',
        };

        const res = await request(app).post('/addTheater').send(newTheater);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Theater added successfully');

        const queryCalls = mysql.createConnection().query.mock.calls;

        expect(queryCalls[0][0]).toContain('INSERT INTO Theater');
        expect(queryCalls[0][1]).toEqual([
            newTheater.Theater_Name,
            newTheater.Location,
            newTheater.City,
            newTheater.EirCode,
            newTheater.Mobile,
            newTheater.Email,
        ]);
    });

    it('should return an error if any field is missing', async () => {
        const incompleteTheater = {
            Theater_Name: 'New Theater',
            Location: 'Dublin',
            City: 'City Center',
            EirCode: 'D02AX23',
            Mobile: 1234567890,
        };

        const res = await request(app).post('/addTheater').send(incompleteTheater);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });
});


afterAll(() => {
    if (server) {
        server.close();
    }
});
