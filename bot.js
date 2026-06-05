require("dotenv").config();

const express = require("express");
const { Telegraf } = require("telegraf");

const {
  initDB,
  saveReminder,
  getDueReminders,
  deleteReminder
} = require("./db");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

/* ---------------- INIT DB ---------------- */
(async () => {
  try {
    await initDB();
    console.log("DB initialized successfully");
  } catch (err) {
    console.error("DB INIT ERROR:", err);
  }
})();

/* ---------------- START ---------------- */
bot.start((ctx) => {
  ctx.reply("Bot is alive and connected.");
});

/* ---------------- SET REMINDER ---------------- */
bot.command("set", async (ctx) => {
  try {
    const parts = ctx.message.text.split(" ");
    const text = parts.slice(1).join(" ");

    if (!text) {
      return ctx.reply("Usage: /set buy milk");
    }

    const run_at = Date.now() + 60 * 1000;

    await saveReminder({
      chat_id: String(ctx.chat.id),
      message: text,
      run_at
    });

    ctx.reply(`Reminder saved ✅\n📝 ${text}\n⏳ Will trigger in 1 minute`);
  } catch (err) {
    console.error(err);
    ctx.reply("Failed to save reminder ❌");
  }
});

/* ---------------- TELEGRAM ECHO ---------------- */
bot.on("text", (ctx) => {
  ctx.reply("Received: " + ctx.message.text);
});

/* ---------------- GET BOT INFO ---------------- */
bot.telegram.getMe()
  .then((info) => {
    console.log("Telegram connected as:", info.username);
  })
  .catch((err) => {
    console.error("Telegram error:", err);
  });

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Bot is alive");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

bot.launch();
