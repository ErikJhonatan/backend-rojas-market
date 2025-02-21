const { Client } = require('pg');

async function getConnection() { 
    const client = new Client({
        user: '',
        host: 'localhost',
        database: 'my_store',
        password: '',
        port: 5432,
    });

    await client.connect();
    return client;
}

module.exports = getConnection;