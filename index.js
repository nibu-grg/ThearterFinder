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
        connection.query(query, (err, results) => {
            response.status(200).json(results);
        });
    });

});

app.get('/search', (req, res, next) => {
    const connection = mysql.createConnection(mysqlConnection);
    const searchTerm = req.query.theatername;
    if (!searchTerm) {
        return res.status(400)
            .json(
                {
                    error: 'Theater name is required'
                }
            );
    }
 
    const query = `
    SELECT * FROM Theater
    WHERE Theater_Name LIKE ?
  `;
 
    const searchValue = `%${searchTerm}%`;
 
    connection.query(query, [searchValue, searchValue],
        (err, results) => {
            if (err) {
                console
                    .error('Error executing search query:', err);
                return res.status(500)
                    .json(
                        {
                            error: 'Internal server error'
                        });
            }
 
            res.json(results);
        });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

