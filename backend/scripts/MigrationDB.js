// scripts/migrateDatabase.js
// Run this script to migrate your existing database to the new structure
// Usage: node scripts/migrateDatabase.js

import sequelize from "../src/config/database.js";
import User from "../src/models/User.js";
import Company from "../src/models/Company.js";
import Contact from "../src/models/Contact.js";

async function migrateDatabase() {
    try {
        console.log("🔄 Starting database migration...");

        // Connect to database
        await sequelize.authenticate();
        console.log("✅ Database connection established");

        // Option 1: DROP AND RECREATE (Use with caution - deletes all data!)
        console.log("⚠️  WARNING: This will DROP existing tables and recreate them!");
        console.log("⚠️  ALL EXISTING DATA WILL BE LOST!");
        console.log("⚠️  Press Ctrl+C to cancel within 5 seconds...");

        await new Promise(resolve => setTimeout(resolve, 5000));

        // Drop tables in correct order (reverse of dependencies)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await Contact.drop({ cascade: true });
        console.log("🗑️  Dropped contacts table");

        await Company.drop({ cascade: true });
        console.log("🗑️  Dropped companies table");

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Recreate tables with new structure
        await Company.sync({ force: false });
        console.log("✅ Created companies table with new structure");

        await Contact.sync({ force: false });
        console.log("✅ Created contacts table with new structure");

        console.log("✅ Migration completed successfully!");
        console.log("\n📋 New table structures:");
        console.log("   - companies: userId, heading, companyName, website, displayUrl, email, bio, logo, view360, googleLocation, googleReviews, socialLinks, status");
        console.log("   - contacts: userId, companyId, firstName, lastName, telephone, mobile, email, designation, photo, label, country, streetAddress, streetAddressLine2, city, postalCode, poBox, status");

    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        await sequelize.close();
        console.log("🔌 Database connection closed");
    }
}

// Option 2: Safe Migration (Preserves data - use ALTER TABLE)
async function safeMigration() {
    try {
        console.log("🔄 Starting SAFE database migration...");

        await sequelize.authenticate();
        console.log("✅ Database connection established");

        // Add new columns to existing tables without dropping
        await sequelize.sync({ alter: true });
        console.log("✅ Tables updated with new columns (existing data preserved)");

        console.log("\n📋 Migration Notes:");
        console.log("   ✅ New columns added to existing tables");
        console.log("   ✅ Existing data preserved");
        console.log("   ⚠️  Please verify data integrity after migration");

    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

// Choose migration method
const args = process.argv.slice(2);
const method = args[0] || 'safe';

if (method === 'force') {
    console.log("🔥 Running FORCE migration (will delete all data)");
    migrateDatabase();
} else {
    console.log("🛡️  Running SAFE migration (preserves existing data)");
    safeMigration();
}

// Export for use in other scripts
export { migrateDatabase, safeMigration };
