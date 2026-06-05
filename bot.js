require("dotenv").config();

const express = require("express");
const { Telegraf } = require("telegraf");
const { initDB } = require("./db");

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

bot.start((ctx) => { ctx.reply("Bot is 
  alive and connected.");
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

app.get("/", (req, res) => {
  res.send("Bot is alive");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

bot.launch();
