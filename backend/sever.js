const express = require("express");
const app = express();
const cros = require("cors");
const connectdb = require("./db/connectdb");
require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT;
require("colors");





app.use(cros());
app.use(express.json());







app.listen(PORT, async () => {
  try {
      console.log(`server work >>> PORT:${PORT}`);
    await connectdb();
  } catch (err) {
    console.log("log listin");
  }
});
