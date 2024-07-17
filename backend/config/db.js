const mysql = require('mysql2');
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '1112',
  database: process.env.DB_NAME || 'tourist_guide'
};

// Criação da conexão com o MySQL
const db = mysql.createConnection(dbConfig);

// Conectar ao banco de dados MySQL
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    throw err;
  }
  console.log('Conexão com o MySQL estabelecida com sucesso.');
});

module.exports = db;
