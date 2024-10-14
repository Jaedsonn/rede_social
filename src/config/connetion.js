const mysql = require('mysql2/promise');

async function connect() {
    const connection = await mysql.createConnection({
        host: 'localhost',    
        user: 'root',        
        password: 'jaedson',
        database: 'task_manager'
    });

    return connection;
}

// Exporta a função para ser usada em outros arquivos
module.exports = connect;
