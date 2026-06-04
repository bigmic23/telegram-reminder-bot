console.log("BOT START TEST");

require("dotenv").config();
const express = require("express");
const { Telegraf } = require("telegraf");
const { initDB, saveReminder } = require("./db");

const app = express();
app.use(express.json());

/* ---------------- INIT DB ---------------- */

(async () => {
  try {
    await initDB();
    console.log("DB connected successfully");
  } catch (err) {
    console.error("DB INIT ERROR:", err);
  }
})();

/* ---------------- TELEGRAM BOT ---------------- */

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Bot is alive and connected.");
});

bot.command("set", async (ctx) => {
  try {
    const text = ctx.message.text.split(" ").slice(1).join(" ");

    if (!text) {
      return ctx.reply("Usage: /set your reminder message");
    }

    const run_at = Date.now() + 60 * 1000;

    await saveReminder({
      chat_id: String(ctx.chat.id),
      message: text,
      run_at
    });

    ctx.reply(`Reminder saved!\n\n📝 ${text}\n⏳ Will trigger in 1 minute`);

  } catch (err) {
    console.error("SET COMMAND ERROR:", err);
    ctx.reply("Failed to save reminder");
  }
});

bot.on("text", (ctx) => {
  ctx.reply("Received: " + ctx.message.text);
});

bot.telegram.getMe().then((info) => {
  console.log("Telegram connected as:", info.username);
});

/* ---------------- EXPRESS SERVER ---------------- */

app.get("/", (req, res) => {
  res.send("Bot is alive");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

/* ---------------- START BOT ---------------- */

bot.launch();
