const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const { Telegraf } = require("telegraf");
const { initDB, getUserReminders } = require("./db");

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("Missing BOT_TOKEN");
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Bot is alive and running.");
});

bot.command("list", async (ctx) => {
  try {
    const rows = await getUserReminders(
      String(ctx.chat.id)
    );

    if (!rows.length) {
      return ctx.reply("No active reminders");
    }

    let text = "Active reminders:\n\n";

    rows.forEach((r, i) => {
      const left = Math.max(
        0,
        Math.floor((r.run_at - Date.now()) / 1000)
      );

      text +=
        `${i + 1}. ${r.message}\n` +
        `⏳ ${left}s left\n\n`;
    });

    ctx.reply(text);

  } catch (err) {
    console.error(err);
    ctx.reply("Database error");
  }
});

async function bootstrap() {
  try {
    await initDB();
    console.log("DB ready");

    const WEBHOOK_URL = process.env.WEBHOOK_URL;

    app.use(bot.webhookCallback("/telegram"));

    bot.telegram.setWebhook(`${WEBHOOK_URL}/telegram`);

    app.get("/", (req, res) => {
      res.send("Bot is alive");
    });

    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => 
    console.log("Webhook server 
    started\nRunning on Render");

  } catch (err) {
    console.error("BOOT ERROR FULL:", 
err); console.error("STACK:", err?.stack);
    process.exit(1);
  }
}

bootstrap();
