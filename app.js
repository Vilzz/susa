const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>Работает</h1>");
});

const server = app.listen(PORT, () =>
  console.log(
    `Сервер запущен в режиме ${process.env.NODE_ENV} на порту ${PORT}`
  )
);
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
