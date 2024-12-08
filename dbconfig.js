const mysqlConnection = {
    host: process.env.DB_HOST || 'localhost',        
    user: process.env.DB_USER || 'root',    
    password: process.env.DB_PASSWORD || 'BusinessSchool@123',
    database: process.env.DB_NAME || 'InformationCA1', 
    port: process.env.DB_PORT || 3306    
};

module.exports = { mysqlConnection };
