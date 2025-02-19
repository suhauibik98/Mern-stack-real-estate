const mangoose = require("mongoose");

const connectdb = async () => {
  try {
    await mangoose.connect(process.env.DB_URL);
    console.log("connecting DB".bgGreen.bold);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectdb;
