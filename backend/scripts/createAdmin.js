import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import sequelize from "../src/config/database.js";
import Admin from "../src/models/admin.js";

dotenv.config();

async function run() {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // ensure table exists
        const username = "superadmin";
        const email = "admin@example.com";
        const password = "SuperStrongPassword123!";
        const hashed = await bcrypt.hash(password, 10);
        const [admin, created] = await Admin.findOrCreate({
            where: { username },
            defaults: { username, email, password: hashed, name: "Super Admin", status: "active" }
        });
        console.log("Admin created:", admin.username, "created?", created);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
