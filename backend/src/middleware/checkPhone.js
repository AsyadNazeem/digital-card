import User from "../models/User.js";

export async function ensurePhoneNumber(req, res, next) {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user || !user.phone) {
            return res.status(403).json({
                success: false,
                requirePhone: true,
                message: "Phone number required to continue.",
            });
        }

        next();
    } catch (err) {
        console.error("❌ Phone check error:", err);
        res.status(500).json({ message: "Error verifying phone status" });
    }
}
