console.log("BOT START TEST");

require("dotenv").config();
const express = require("express");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

/* ---------------- TELEGRAM BOT ---------------- */

bot.start((ctx) => {
  ctx.reply("Bot is alive and connected.");
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

/* ---------------- START BOT ---------------- */

bot.launch();
