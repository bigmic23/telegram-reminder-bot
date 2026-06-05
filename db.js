require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/* ---------------- INIT DB ---------------- */

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        chat_id TEXT NOT NULL,
        message TEXT NOT NULL,
        run_at BIGINT NOT NULL
      )
    `);

    console.log("DB initialized successfully");
  } catch (err) {
    console.error("DB INIT FAILED:", err);
    throw err;
  }
}

/* ---------------- SAVE REMINDER ---------------- */

async function saveReminder({ chat_id, message, run_at }) {
  return pool.query(
    "INSERT INTO reminders (chat_id, message, run_at) VALUES ($1, $2, $3)",
    [chat_id, message, run_at]
  );
}

/* ---------------- GET USER REMINDERS ---------------- */

async function getUserReminders(chat_id) {
  const res = await pool.query(
    "SELECT * FROM reminders WHERE chat_id = $1",
    [chat_id]
  );
  return res.rows;
}

/* ---------------- GET DUE REMINDERS ---------------- */

async function getDueReminders(now) {
  const res = await pool.query(
    "SELECT * FROM reminders WHERE run_at <= $1",
    [now]
  );
  return res.rows;
}

/* ---------------- DELETE REMINDER ---------------- */

async function deleteReminder(id) {
  return pool.query(
    "DELETE FROM reminders WHERE id = $1",
    [id]
  );
}

/* ---------------- EXPORTS ---------------- */

module.exports = {
  initDB,
  saveReminder,
  getUserReminders,
  getDueReminders,
  deleteReminder
};
