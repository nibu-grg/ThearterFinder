const request = require('supertest');
const { app, server } = require('../index.js');
const mysql = require('mysql2');

jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn((callback) => callback(null)),
    query: jest.fn().mockImplementation((query, values, callback) => {
      if (query.includes("INSERT INTO Theater")) {
        callback(null, { insertId: 1 });
      } else if (query.includes("SELECT * FROM Theater")) {
        callback(null, [
          { Theater_ID: 1, Theater_Name: 'Theater 1', Location: 'Dublin', City: 'Dublin', EirCode: 'D02AX23', Mobile: 1234567890, Email: 'theater1@example.com' }
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
      Theater_Name: 'Test Theater',
      Location: 'Dublin1',
      City: 'City Center',
      EirCode: 'D02AX23',
      Mobile: 8988878,
      Email: 'testtheater@example.com',
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
      Theater_Name: 'Test Theater',
      Location: 'Dublin1',
      City: 'City Center',
      EirCode: 'D02AX23',
      Mobile: 8898688,
    };

    const res = await request(app).post('/addTheater').send(incompleteTheater);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('All fields are required');
  });

  it('should return 500 error on database error', async () => {
    const newTheater = {
      Theater_Name: 'Test Theater',
      Location: 'Dublin1',
      City: 'City Center',
      EirCode: 'D02AX23',
      Mobile: 1234567890,
      Email: 'testtheater@example.com',
    };

    mysql.createConnection().query.mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const res = await request(app).post('/addTheater').send(newTheater);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Unexpected server error');
  });
});

describe('GET /theaters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of theaters', async () => {
    const mockTheaters = [
      { Theater_ID: 1, Theater_Name: 'Theater 1', Location: 'Dublin', City: 'Dublin', EirCode: 'D02AX23', Mobile: 1234567890, Email: 'theater1@example.com' },
      { Theater_ID: 2, Theater_Name: 'Theater 2', Location: 'Cork', City: 'Cork', EirCode: 'C03BY45', Mobile: 9876543210, Email: 'theater2@example.com' }
    ];

    mysql.createConnection().query.mockImplementationOnce((query, callback) => {
      callback(null, mockTheaters);
    });

    const res = await request(app).get('/theaters');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockTheaters);
  });

  it('should handle query execution errors', async () => {
    mysql.createConnection().query.mockImplementationOnce(() => {
      throw new Error('Query execution error');
    });

    const res = await request(app).get('/theaters');

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Query execution error');
  });
});
