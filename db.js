
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS problems (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            platform VARCHAR(100) NOT NULL,
            topic VARCHAR(100) NOT NULL,
            difficulty VARCHAR(10) NOT NULL
                CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
            "problemLink" TEXT DEFAULT '',
            solution TEXT DEFAULT '',
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("PostgreSQL table is ready");
}

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;
