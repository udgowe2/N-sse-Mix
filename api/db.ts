import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let connection: mysql.Pool;

export const pool = {
    query: async (sql: string, params: any[] = []) => {
        if (!connection) {
            throw new Error("Database not initialized. Call initDb() first.");
        }
        // Convert SQLite style '?' to MySQL style if necessary, 
        // but mysql2 already uses '?' as placeholder.
        return await connection.query(sql, params);
    }
};

export async function initDb() {
    try {
        const config = {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3447'), // User specified port 3447
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Welcome25$',
            database: process.env.DB_NAME || 'baahi',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };

        connection = mysql.createPool(config);

        // Test connection
        await connection.query('SELECT 1');

        console.log("MariaDB (MySQL) Database initialized successfully");

        // Create tables if they don't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS recipes (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                image TEXT,
                prepTime VARCHAR(50),
                mealTime VARCHAR(50),
                category VARCHAR(50),
                ingredients TEXT,
                instructions TEXT,
                tags TEXT,
                sourceUrl TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS planner (
                id VARCHAR(255) PRIMARY KEY,
                weekId VARCHAR(50) DEFAULT 'current',
                dayIndex INT NOT NULL,
                mealType VARCHAR(50) NOT NULL,
                recipeIds TEXT,
                helperName VARCHAR(255)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS shopping_list (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                amount VARCHAR(255),
                isCompleted TINYINT(1) DEFAULT 0
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS daily_tasks (
                id VARCHAR(255) PRIMARY KEY,
                dateStr VARCHAR(10) NOT NULL,
                text VARCHAR(500) NOT NULL,
                isCompleted TINYINT(1) DEFAULT 0,
                isSmartTask TINYINT(1) DEFAULT 0
            )
        `);

    } catch (error) {
        console.error("Failed to initialize MariaDB Database:", error);
        throw error;
    }
}
