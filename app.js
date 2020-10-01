const express = require("express");
const App = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 5000;
const server = App.listen(PORT, () =>
  console.log(
    `Сервер запущен в режиме ${process.env.NODE_ENV} на порту ${PORT}`
  )
);
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
