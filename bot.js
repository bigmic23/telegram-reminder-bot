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
(async () => {
  try {
    await initDB();
    console.log("DB connected successfully");
  } catch (err) {
    console.error("DB INIT ERROR:", err);
  }
})();

async function checkReminders() {
  try {
    const now = Date.now();
    const reminders = await getDueReminders(now);

    for (const r of reminders) {
      await bot.telegram.sendMessage(
        r.chat_id,
        `⏰ Reminder: ${r.message}`
      );

      await deleteReminder(r.id);
    }
  } catch (err) {
    console.error("Worker error:", err);
  }
}

setInterval(checkReminders, 5000);

bot.start((ctx) => {
  ctx.reply("Bot is alive and connected.");
});
bot.command("set", async (ctx) => {
  try {
    const text = ctx.message.text.split(" ").slice(1).join(" ");

bot.command("set", async (ctx) => { try { 
    const text = ctx.message.text.split(" 
    ").slice(1).join(" ");

    if (!text) {
      return ctx.reply("Usage: /set buy milk");
    }

    const run_at = Date.now() + 60 * 1000;

    await saveReminder({
      chat_id: String(ctx.chat.id),
      message: text,
      run_at
    });

    ctx.reply(
      `Reminder saved ✅\n📝 ${text}\n⏳ Will trigger in 1 minute`
    );

  } catch (err) {
    console.error("SET COMMAND ERROR:", err);
    ctx.reply("Failed to save reminder ❌");
  }
});
bot.on("text", (ctx) => { 
  ctx.reply("Received: " + 
  ctx.message.text);
});

bot.telegram.getMe()
  .then((info) => {
    console.log("Telegram connected as:", info.username);
  })
  .catch((err) => {
    console.error("Telegram error:", err);
  });

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => { res.send("Bot is alive");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

bot.launch();
