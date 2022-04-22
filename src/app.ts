import cors from "cors";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/posts.routes";

const app = express();

// Settings
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

// Use cors with origin localhost:3000
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

export default app;
