import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js"; // ✅ must exist
import User from "./models/User.js"; // ✅ import your models here
import Company from "./models/Company.js";
import Contact from "./models/Contact.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import path from "path";
import { fileURLToPath } from "url";
import publicRoutes from "./routes/public.js";
import Admin from "./models/Admin.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminRoutes from "./routes/admin.js";
import otpRoutes from "./routes/otp.js";
import settingsRoutes from "./routes/settings.js";
import googleAuthRoutes from "./routes/auth.js"; // if you added it there

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", publicRoutes);
// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", googleAuthRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Express backend is running!");
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");

        // 🔥 THIS LINE CREATES TABLES AUTOMATICALLY
        await sequelize.sync(); //{ force: true }
        console.log("✅ Tables synchronized");

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
}

startServer();
