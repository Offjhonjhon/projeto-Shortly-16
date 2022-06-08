import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});

if (process.env.MODE === "PROD") {
    db.ssl = {
        rejecUnauthorized: false
    }
}

export default db;