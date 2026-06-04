console.log("BOOT OK");

const express = require("express");
const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Alive");
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
