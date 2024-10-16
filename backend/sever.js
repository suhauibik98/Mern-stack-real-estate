require("dotenv").config({ path: "./.env" });
require("colors");

const express = require("express");
const app = express();
const cors = require("cors");
const connectdb = require("./db/connectdb");
const PORT = process.env.PORT;
const cookieParser = require("cookie-parser")

app.use(cors({credentials : true}));
app.use(express.json());
app.use(cookieParser());




const UserRouter = require("./routes/userRoutes");
app.use("/api/user", UserRouter);

const AuthRouter = require("./routes/authRouter");
app.use("/api/auth", AuthRouter);


const ListingRouter = require("./routes/listingRouter")
app.use("/api/listing", ListingRouter);


// const listenIng = r


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



// PORT=5000

// DB_URL = "mongodb+srv://suhaib:Suhaib123456789@cluster0.a3obgc0.mongodb.net/ESTATE-MERN?retryWrites=true&w=majority&appName=Cluster0"
// JWT_SECRET= "703e534c1cab2f3b33ec00c1bf526e81e9cfddcd3c3b3f03aa9da4ef88ec045c"
//4:42:46