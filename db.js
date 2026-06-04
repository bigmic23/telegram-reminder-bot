require("dotenv").config();

const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

const pool = new Pool({ connectionString: 
  process.env.DATABASE_URL, ssl: { 
  rejectUnauthorized: false }
});

module.exports = pool;

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reminders (
      id SERIAL PRIMARY KEY,
      chat_id TEXT,
      message TEXT,
      run_at BIGINT
    )
  `);

  console.log("DB connected successfully");
}

async function addReminder(chatId, message, runAt) {
  return pool.query(
    "INSERT INTO reminders (chat_id, message, run_at) VALUES ($1,$2,$3)",
    [chatId, message, runAt]
  );
}

async function getUserReminders(chatId) {
  const res = await pool.query(
    "SELECT * FROM reminders WHERE chat_id = $1",
    [chatId]
  );
  return res.rows;
}

async function getDueReminders(now) {
  const res = await pool.query(
    "SELECT * FROM reminders WHERE run_at <= $1",
    [now]
  );
  return res.rows;
}

async function deleteReminder(id) {
  return pool.query(
    "DELETE FROM reminders WHERE id = $1",
    [id]
  );
}

module.exports = {
  initDB,
  addReminder,
  getUserReminders,
  getDueReminders,
  deleteReminder
};
