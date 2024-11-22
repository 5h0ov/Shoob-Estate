import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/posts.route.js";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";
import contactRoutes from "./routes/contact.route.js";
import signRoutes from "./routes/sign.route.js";
import utilsRoutes from "./routes/utils.route.js";
import { ENV_VARS } from "./config/envVar.js";

const app = express();
// dotenv.config();
const PORT = ENV_VARS.PORT;

app.use(express.json()); // hey express, parse incoming requests with JSON payloads
app.use(cookieParser()); // hey express, parse cookies
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shoob-estate-ocou.vercel.app",
    ],
    credentials: true, // hey express, allow cookies to be sent back and forth
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(compression());

app.use("/api/auth", authRoutes); // hey express, use the authRoutes for any requests that start with /api/auth
// this is done to keep the codebase clean and modular
app.use("/api/posts", postRoutes); // hey express, use the passRoutes for any requests that start with /api/pass
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/contact", contactRoutes)
app.use("/uploads", express.static("uploads"));
app.use("/api/util", utilsRoutes)

// to generate a signature for cloudinary signed uploads
app.use("/api/sign", signRoutes);



// to serve the frontend in production
// so with this we can access the react app using the port of the backend

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist"))); // dist is from running build from the package.json in the frontend  and __dirname means under root
//   app.get("*", (req, res) => {
//     // for any other routes other than the backend api routes
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     path.resolve(__dirname, "frontend", "build", "index.html");
//   });
// }

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);
  // connectDB();
});

app.get("/", (req, res) => {
  res.send("hello api is cooking");
});