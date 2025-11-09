import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT,
        logging: false,
    }
);

// Test route
app.get("/", (req, res) => {
    res.send("🚀 Express backend is running!");
});

// Start server
sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Database connected successfully");
        app.listen(process.env.PORT || 4000, () => {
            console.log(`🚀 Server running at http://localhost:${process.env.PORT || 4000}`);
        });
    })
    .catch((err) => console.error("❌ Database connection failed:", err));
