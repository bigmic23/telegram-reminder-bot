console.log("BOOT STARTED");

console.log("ENV CHECK:", {
  BOT_TOKEN: !!process.env.BOT_TOKEN,
  DATABASE_URL: !!process.env.DATABASE_URL,
  PORT: process.env.PORT
});

setInterval(() => {}, 1000);
