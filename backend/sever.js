require("dotenv").config({ path: "./.env" });
require("colors");

const express = require("express");
const app = express();
const cors = require("cors");
const connectdb = require("./db/connectdb");
const PORT = process.env.PORT;

app.use(cors({credentials : true}));
app.use(express.json());




const UserRouter = require("./routes/userRoutes");
app.use("/api/user", UserRouter);

const AuthRouter = require("./routes/authRouter");
app.use("/api/auth", AuthRouter);




app.listen(PORT, async () => {
  try {
    console.log(`server work >>> PORT:${PORT}`);
    await connectdb();
  } catch (err) {
    console.log("log listen");
  }
});


app.use((err , req , res , next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internet Server Error";

  return res.status(statusCode).json({
    success:false,
    statusCode, 
    message,

  })
})
