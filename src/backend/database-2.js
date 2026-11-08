import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

try {
  await db.query("SELECT NOW()");
  console.log("postgre conected");
} catch (error) {
  console.log("conection failed");
  console.log(error.message);
}

export default db;
