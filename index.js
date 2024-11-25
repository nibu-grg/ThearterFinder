const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');


const app = express();
app.use(express.static('public'));


app.use(bodyParser.json());

app.get("/", (request, response) => {
    response.json({
        info: 'Hello world!'
    });
});


const mysqlConnection = {
    host: 'localhost',        
    user: 'root',    
    password: 'BusinessSchool@123',
    database: 'InformationCA1', 
    port: 3306    
};


app.get('/theaters', (request, response) => {
    const connection = mysql.createConnection(mysqlConnection);
    const query = 'SELECT * FROM Theater';
    connection.connect((err) => {
        if (err) {
            console.error('Database connection error:', err);
            return response.status(500).json({ error: 'Database connection error' });
        }

        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return response.status(500).json({ error: 'Query execution error' });
            }

            response.status(200).json(results);
        });
    });
});

app.get('/search', (req, res) => {
    const connection = mysql.createConnection(mysqlConnection);
    const searchTerm = req.query.EirCode;

    if (!searchTerm) {
        return res.status(400).json({ error: 'Eircode is required' });
    }

    const query = `
        SELECT * FROM Theater
        WHERE EirCode LIKE ?
    `;

    const searchValue = `%${searchTerm}%`;

    connection.query(query, [searchValue], (err, results) => {
        if (err) {
            console.error('Error executing search query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length > 0) {
            return res.status(200).json(results); 
        } else {
            return res.status(404).json({ message: 'No theaters found for this Eircode' });
        }
    });
});


app.post("/addTheater", (req, res) => {
    const connection = mysql.createConnection(mysqlConnection);
    const { Theater_Name, Location, City, EirCode, Mobile, Email } = req.body;

    if (!Theater_Name || !Location || !City || !EirCode || !Mobile || !Email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = `
        INSERT INTO Theater (Theater_Name, Location, City, EirCode, Mobile, Email)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [Theater_Name, Location, City, EirCode, Mobile, Email];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error executing insert query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        console.log("Insert successful, ID:", result.insertId);
        return res.status(201).json({ message: "Theater added successfully", id: result.insertId });
    });
});


app.delete("/deleteTheater/:id", (req, res) => {
    const connection = mysql.createConnection(mysqlConnection);
    const theaterId = req.params.id;

    if (!theaterId) {
        return res.status(400).json({ message: "Theater ID is required" });
    }

    const query = `
        DELETE FROM Theater WHERE Theater_ID = ?
    `;

    connection.query(query, [theaterId], (err, result) => {
        if (err) {
            console.error("Error executing delete query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Theater not found" });
        }

        res.status(200).json({ message: "Theater deleted successfully" });
    });
});


  
  

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

