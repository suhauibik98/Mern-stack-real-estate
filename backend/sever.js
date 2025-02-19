// require("dotenv").config({ path: "./.env" });

// require("colors");

// const path = require("path");

// const express = require("express");

// const app = express();

// const cors = require("cors");

// const connectdb = require("./db/connectdb");

// const PORT = process.env.PORT;

// const PORTSocket = process.env.PORTSocket;

// const fileUpload = require("express-fileupload");

// const mongoSantize = require("express-mongo-sanitize");

// const { Server } = require("socket.io");

// const http = require("http");

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://10.10.30.30:5173",
//     methods: ["GET", "POST"],
//   },
// });

// app.use(cors({ credentials: true, origin: "http://10.10.30.30:5173" }));

// app.use(express.json());

// app.use(mongoSantize());

// app.use(
//   fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 }, //5mb
//     tempFilePath: path.join(__dirname, "uploads"),
//     useTempFiles: true,
//   })
// );

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const userSocketMap = new Map();

// io.on("connection", (socket) => {
//   console.log("a new client connected", socket.id);

//   socket.on("register", (userId) => {
//     userSocketMap.set(userId, socket.id);
//     console.log(`User ${userId} registered with socket ${socket.id}`);
//   });
//   socket.on("chenge-role", (data) => {
//     console.log("data", data);
//     const targetSocketId = userSocketMap.get(data?._id);
//     if (targetSocketId) {
//       io.to(targetSocketId).emit("chenge-role-done", data);
//       console.log("role has been changed");
//     } else {
//       console.log("user not found");
//     }
//     // socket.join(data.room)
//   });

//   socket.on("delete_user", (userId) => {
//     const targetSocketId = userSocketMap.get(userId);
//     if (targetSocketId) {
//       io.to(targetSocketId).emit("delete_user");
//       userSocketMap.delete(userId);
//     }
//     console.log(`User ${userId} deleted from socket map`);
//     // socket.to(message.room).emit('receive_message', message)
//   });

//   socket.on("block-user", (userId) => {
//     console.log("block-user", userId);
//     const targetSocketId = userSocketMap.get(userId);
//     if (targetSocketId) {
//       io.to(targetSocketId).emit("blocked"); // Send event to the specific user
//       console.log(`User ${userId} has been blocked`);
//     } else {
//       console.log(`No active connection for user ${userId}`);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected", socket.id);
//     for (const [userId, socketId] of userSocketMap.entries()) {
//       if (socketId === socket.id) {
//         userSocketMap.delete(userId);
//         console.log(`Removed mapping for user ${userId}`);
//         break;
//       }
//     }
//   });
// });

// const UserRouter = require("./routes/userRoutes");
// app.use("/api/user", UserRouter);

// const AuthRouter = require("./routes/authRouter");
// app.use("/api/auth", AuthRouter);

// const ListingRouter = require("./routes/listingRouter");
// app.use("/api/listing", ListingRouter);

// const AdminRouter = require("./routes/adminRouter");
// app.use("/api/admin", AdminRouter);

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internet Server Error";
//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });

// app.listen(PORT, async () => {
//   try {
//     console.log(`server work >>> PORT:${PORT}`);
//     await connectdb();
//   } catch (err) {
//     console.log("log listen");
//   }
// });

// server.listen(PORTSocket, async () => {
//   try {
//     console.log(`server work >>> PORT:${PORTSocket}`);
//     // await connectdb();
//   } catch (err) {
//     console.log("log listen");
//   }
// });
require("dotenv").config({ path: "./.env" });
require("colors");

const path = require("path");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const { Server } = require("socket.io");
const http = require("http");
const morgan = require("morgan");
const connectdb = require("./db/connectdb");


// const fs = require("fs")
// const zlib = require("zlib")

// const readDoc =  fs.createReadStream("./uploads/document/New Text Document.txt")
// const writeDoc = fs.createWriteStream("./uploads/document/hi.zip")
// const giz = zlib.createGzip()
// readDoc.pipe(giz).pipe(writeDoc)
// // readDoc.on("data" , (chanck)=>{
// //   console.log(chanck.toString())
// // })

// writeDoc.on("end",()=>{
//   console.log("end")
// })

const PORT = process.env.PORT || 5000;
const PORTSocket = process.env.PORTSocket || 5001;

if (!PORT || !PORTSocket) {
  console.error("❌ Missing environment variables: PORT or PORTSocket");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://10.10.30.30:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
// app.use(morgan("dev"));
app.use(cors({
  origin: "http://10.10.30.30:5173",
  methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use(mongoSanitize({ replaceWith: "_", allowDots: false }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  tempFilePath: path.join(__dirname, "uploads"),
  useTempFiles: true,
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true,
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("🔗 New client connected:", socket.id);

  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`🟢 User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("chenge-role", (data) => {
    console.log("🔄 Role change:", data);
    const targetSocketId = userSocketMap.get(data?._id);
    if (targetSocketId) {
      io.to(targetSocketId).emit("chenge-role-done", data);
      console.log("✅ Role has been changed");
    } else {
      console.log("❌ User not found");
    }
  });

  socket.on("delete_user", (userId) => {
    const targetSocketId = userSocketMap.get(userId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("delete_user");
      userSocketMap.delete(userId);
    }
    console.log(`🗑️ User ${userId} deleted from socket map`);
  });

  socket.on("block-user", (userId) => {
    console.log("⛔ Blocking user:", userId);
    const targetSocketId = userSocketMap.get(userId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("blocked");
      console.log(`✅ User ${userId} has been blocked`);
    } else {
      console.log(`❌ No active connection for user ${userId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
    userSocketMap.forEach((value, key) => {
      if (value === socket.id) {
        userSocketMap.delete(key);
        console.log(`❌ Removed mapping for user ${key}`);
      }
    });
  });
});

// Routes
const UserRouter = require("./routes/userRoutes");
app.use("/api/user", UserRouter);
const AuthRouter = require("./routes/authRouter");
app.use("/api/auth", AuthRouter);
const ListingRouter = require("./routes/listingRouter");
app.use("/api/listing", ListingRouter);
const AdminRouter = require("./routes/adminRouter");
app.use("/api/admin", AdminRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});




// Start Server
server.listen(PORTSocket, async () => {
  try {
    console.log(`🚀 Socket.IO Server Running on Port: ${PORTSocket}`);
  } catch (err) {
    console.error("❌ Error starting socket server:", err.message);
  }
});

app.listen(PORT, async () => {
  try {
    console.log(`🚀 Express Server Running on Port: ${PORT}`);
    await connectdb();
  } catch (err) {
    console.error("❌ Error starting Express server:", err.message);
  }
});
