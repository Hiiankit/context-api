import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.json({});
});

const mongoUri = process.env.MONGO_URI;
const localMongoUri =
  process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/toastdb";

if (mongoUri) {
  const redactedUri = mongoUri.replace(/:([^@]+)@/, ":****@");
  console.log("Attempting to connect to:", redactedUri);
} else {
  console.warn("MONGO_URI is missing. Falling back to local MongoDB.");
}

app.use("/api/auth", authRoutes);

async function startServer() {
  const targetUri = mongoUri || localMongoUri;
  try {
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 8000 });
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on ${process.env.PORT}`),
    );
  } catch (err) {
    if (mongoUri && /server selection|could not connect/i.test(err.message)) {
      try {
        console.warn(
          "Atlas unavailable. Falling back to local MongoDB at",
          localMongoUri,
        );
        await mongoose.connect(localMongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB Connected (local fallback)");
        app.listen(process.env.PORT, () =>
          console.log(`Server running on ${process.env.PORT}`),
        );
        return;
      } catch (localErr) {
        console.error("Local MongoDB Connection Error:", localErr.message);
      }
    } else {
      console.error("Mongoose Connection Error:", err.message);
    }
    process.exit(1);
  }
}

startServer();
