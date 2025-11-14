// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("🟢 Decoded token payload:", decoded);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            console.error("❌ User not found for ID:", decoded.id);
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        req.userId = user.id;

        next();
    } catch (err) {
        console.error("❌ Token authentication error:", err);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
