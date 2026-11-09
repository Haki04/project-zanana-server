import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// const db = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });
const db = new pg.Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

try {
  await db.query("SELECT NOW()");
  console.log("postgre conected");
} catch (error) {
  console.log("conection failed");
  console.log(error.message);
}

export default db;
