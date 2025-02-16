const { Client } = require('pg');

async function getConnection() { 
    const client = new Client({
        user: 'user',
        host: 'localhost',
        database: 'my-store',
        password: '',
        port: 5432,
    });

    await client.connect();
    return client;
}