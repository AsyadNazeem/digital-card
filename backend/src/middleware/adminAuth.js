import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";


export const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

        const admin = await Admin.findByPk(decoded.id);
        if (!admin) return res.status(401).json({ message: "Invalid token" });
        if (admin.status !== "active") return res.status(403).json({ message: "admin inactive" });

        req.admin = admin;
        next();
    } catch (err) {
        console.error("❌ admin auth error:", err);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        return res.status(401).json({ message: "Unauthorized" });
    }
};
