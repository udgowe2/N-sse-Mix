import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

let db: ReturnType<typeof Database>;

export const pool = {
    query: async (sql: string, params: any[] = []) => {
        const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
        const stmt = db.prepare(sql);
        if (isSelect) {
            const rows = stmt.all(params);
            return [rows];
        } else {
            const result = stmt.run(params);
            return [result];
        }
    }
};

export async function initDb() {
    try {
        db = new Database(path.join(dbPath, 'database.sqlite'));

        db.exec(`
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
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        db.exec(`
      CREATE TABLE IF NOT EXISTS planner (
        id VARCHAR(255) PRIMARY KEY,
        weekId VARCHAR(50) DEFAULT 'current',
        dayIndex INT NOT NULL,
        mealType VARCHAR(50) NOT NULL,
        recipeIds TEXT,
        helperName VARCHAR(255)
      )
    `);

        try {
            db.exec(`ALTER TABLE planner ADD COLUMN weekId VARCHAR(50) DEFAULT 'current'`);
        } catch (e) {
            // Column might already exist, ignore
        }

        db.exec(`
      CREATE TABLE IF NOT EXISTS shopping_list (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount VARCHAR(255),
        isCompleted TINYINT(1) DEFAULT 0
      )
    `);

        db.exec(`
      CREATE TABLE IF NOT EXISTS daily_tasks (
        id VARCHAR(255) PRIMARY KEY,
        dateStr VARCHAR(10) NOT NULL,
        text VARCHAR(500) NOT NULL,
        isCompleted TINYINT(1) DEFAULT 0,
        isSmartTask TINYINT(1) DEFAULT 0
      )
    `);

        console.log("SQLite Database initialized successfully");
    } catch (error) {
        console.error("Failed to initialize SQLite Database:", error);
        throw error;
    }
}
