const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { mysqlConnection } = require('./dbconfig.js');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());


app.get('/theaters', (request, response) => {
    try {
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
    } catch (error) {
        response.status(500).json({ message: "Unexpected server error", error: error.message });
    }
});

app.get('/search', (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: "Unexpected server error", error: error.message });
    }
});

app.post("/addTheater", (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: "Unexpected server error", error: error.message });
    }
});


app.delete("/deleteTheater/:Theater_Id", (req, res) => {
    const theaterId = req.params.Theater_Id; 
    console.log("Received Theater_Id:", theaterId);
    if (!theaterId) {
        return res.status(400).json({ message: "Theater ID is required" });
    }

    const connection = mysql.createConnection(mysqlConnection);
    connection.connect(err => {
        if (err) {
            console.error("Error connecting to the database:", err);
            return res.status(500).json({ error: "Database connection error" });
        }

        const query = `DELETE FROM Theater WHERE Theater_Id = ?`;

        connection.query(query, [theaterId], (err, results) => {
            connection.end();

            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).json({ error: "Query execution error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Theater not found" });
            }

            res.status(200).json({ message: "Theater deleted successfully" });
        });
    });
});


app.get("/theaterInfo", (req, res) => {
    const id = req.query.Theater_Id;
    console.log("Received Theater_Id:", id);
    
    if (!id) {
        return res.status(400).json({ error: 'Theater_Id is required' });
    }

    const connection = mysql.createConnection(mysqlConnection);
    
    const query = `
        SELECT * FROM Theater
        WHERE Theater_Id = ?
    `;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            connection.end();
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            connection.end();
            return res.status(200).json(results);
        } else {
            connection.end();
            return res.status(404).json({ message: 'No theaters found with this Theater_Id' });
        }

    });
    console.log("Finished fetching");
});

app.put("/updateTheater/:Theater_Id", (req, res) => {
    const Theater_Id = req.params.Theater_Id;
    console.log("Received Theater_Id:", Theater_Id);

    const { Theater_Name, Location, City, EirCode, Mobile, Email } = req.body;
    if (!Theater_Name || !Location || !City || !EirCode || !Mobile || !Email) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const connection = mysql.createConnection(mysqlConnection);
    connection.connect(err => {
        if (err) {
            console.error("Error connecting to database:", err);
            return res.status(500).json({ error: "Database connection error" });
        }

        const query = `
            UPDATE Theater
            SET Theater_Name = ?, Location = ?, City = ?, EirCode = ?, Mobile = ?, Email = ?
            WHERE Theater_Id = ?
        `;
        const values = [Theater_Name, Location, City, EirCode, Mobile, Email, Theater_Id];

        console.log("Update Query Values:", values);

        connection.query(query, values, (err, result) => {
            connection.end(); 

            if (err) {
                console.error("Error executing update query:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Theater not found" });
            }

            console.log("Update successful, affected rows:", result.affectedRows);
            return res.status(200).json({ message: "Theater updated successfully" });
        });
    });
});
const PORT = process.env.PORT || 3000;
let server;
if (require.main === module) {
    server = app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export app and server for testing purposes
module.exports = { app, server };
