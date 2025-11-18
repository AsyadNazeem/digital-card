// scripts/debugThemes.js
// Run this to check your theme setup

import sequelize from "../src/config/database.js";
import User from "../src/models/User.js";
import Company from "../src/models/Company.js";
import Contact from "../src/models/Contact.js";
import Theme from "../src/models/Theme.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load associations
const models = { User, Company, Contact, Theme };
Object.values(models).forEach((model) => {
    if (model.associate) model.associate(models);
});

async function debugThemes() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected\n");

        // 1. Check if themes exist
        console.log("=== CHECKING THEMES TABLE ===");
        const themes = await Theme.findAll();
        console.log(`Found ${themes.length} themes:`);
        themes.forEach(theme => {
            console.log(`  - ID: ${theme.id}, Name: ${theme.name}`);
            console.log(`    CSS File: ${theme.cssFile}`);
            console.log(`    Preview: ${theme.previewImage}`);
            console.log(`    Premium: ${theme.isPremium}\n`);
        });

        // 2. Check file system
        console.log("=== CHECKING FILE SYSTEM ===");
        const uploadsPath = path.join(__dirname, "../../uploads/themes");
        console.log(`Checking directory: ${uploadsPath}`);

        if (!fs.existsSync(uploadsPath)) {
            console.log("❌ Directory does not exist!");
            console.log("Creating directory...");
            fs.mkdirSync(uploadsPath, { recursive: true });
            console.log("✅ Directory created");
        } else {
            console.log("✅ Directory exists");
            const files = fs.readdirSync(uploadsPath);
            console.log(`Files in directory: ${files.length}`);
            files.forEach(file => {
                console.log(`  - ${file}`);
            });
        }

        // 3. Check users with themes
        console.log("\n=== CHECKING USERS ===");
        const users = await User.findAll({
            include: [{
                model: Theme,
                as: "theme"
            }]
        });

        console.log(`Found ${users.length} users:`);
        users.forEach(user => {
            console.log(`  - User ID: ${user.id}, Name: ${user.name}`);
            console.log(`    Selected Theme ID: ${user.selectedThemeId}`);
            console.log(`    Theme: ${user.theme ? user.theme.name : 'No theme'}\n`);
        });

        // 4. Test a public card query
        console.log("=== TESTING PUBLIC CARD QUERY ===");
        const testContact = await Contact.findOne({
            where: { status: "active" },
            include: [{ model: Company }]
        });

        if (testContact) {
            console.log(`Testing with contact: ${testContact.mobile}`);

            const company = await Company.findByPk(testContact.companyId);
            const user = await User.findByPk(company.userId, {
                include: [{ model: Theme, as: "theme" }]
            });

            console.log(`Company: ${company.companyName}`);
            console.log(`User: ${user.name}`);
            console.log(`Theme: ${user.theme ? user.theme.name : 'No theme'}`);
            if (user.theme) {
                console.log(`Theme CSS: ${user.theme.cssFile}`);

                // Check if CSS file exists
                const cssPath = path.join(__dirname, "../..", user.theme.cssFile);
                console.log(`Checking CSS file: ${cssPath}`);
                if (fs.existsSync(cssPath)) {
                    console.log("✅ CSS file exists");
                } else {
                    console.log("❌ CSS file NOT found!");
                }
            }
        } else {
            console.log("No active contacts found for testing");
        }

        console.log("\n=== DEBUG COMPLETE ===");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

debugThemes();
