const request = require('supertest');
const { app, server } = require('../index.js'); 
const mysql = require('mysql2');


jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    query: jest.fn(),
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

  it('should add a new theater successfully', async () => {
    const newTheater = {
      Theater_Name: 'New Theater',
      Location: 'Dublin',
      City: 'City Center',
      EirCode: 'D02AX23',
      Mobile: 1234567890,
      Email: 'newtheater@example.com',
    };

    const queryMock = jest.fn((query, values, callback) => {
      callback(null, { insertId: 1 });
    });
    mysql.createConnection.mockReturnValueOnce({ query: queryMock });

    const res = await request(app).post('/addTheater').send(newTheater);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Theater added successfully');
    expect(res.body.id).toBe(1);

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Theater'),
      [
        newTheater.Theater_Name,
        newTheater.Location,
        newTheater.City,
        newTheater.EirCode,
        newTheater.Mobile,
        newTheater.Email,
      ],
      expect.any(Function)
    );
  });

  it('should return a 400 error if required fields are missing', async () => {
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

  it('should return a 500 error on database query failure', async () => {
    const newTheater = {
      Theater_Name: 'New Theater',
      Location: 'Dublin',
      City: 'City Center',
      EirCode: 'D02AX23',
      Mobile: 1234567890,
      Email: 'newtheater@example.com',
    };

    const queryMock = jest.fn((query, values, callback) => {
      callback(new Error('Database error'), null);
    });
    mysql.createConnection.mockReturnValueOnce({ query: queryMock });

    const res = await request(app).post('/addTheater').send(newTheater);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });

  it('should return a 500 error on unexpected server error', async () => {
    const originalMethod = mysql.createConnection;
    mysql.createConnection = jest.fn(() => {
      throw new Error('Unexpected server error');
    });

    const newTheater = {
      Theater_Name: 'New Theater',
      Location: 'Dublin',
      City: 'City Center',
      EirCode: 'D02AX23',
      Mobile: 1234567890,
      Email: 'newtheater@example.com',
    };

    const res = await request(app).post('/addTheater').send(newTheater);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Unexpected server error');
    expect(res.body.error).toBe('Unexpected server error');

    mysql.createConnection = originalMethod;
  });
});
