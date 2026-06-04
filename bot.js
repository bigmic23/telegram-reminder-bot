console.log("BOT START TEST");

require("dotenv").config();

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

// KEEP PROCESS ALIVE
setInterval(() => {
  console.log("Bot heartbeat...");
}, 10000);
