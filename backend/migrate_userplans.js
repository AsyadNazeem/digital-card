// migrate_userplans.js
// Run once:  node migrate_userplans.js
// ─────────────────────────────────────────────────────────────────────────────
// This script:
//   1. Adds the `duration` column to the `users` table (if missing)
//   2. Creates the `user_plans` table (if missing)
// ─────────────────────────────────────────────────────────────────────────────

import sequelize from "./src/config/database.js";
import { DataTypes, QueryTypes } from "sequelize";

async function run() {
    const qi = sequelize.getQueryInterface();

    // ── 1. Add `duration` column to users if it doesn't exist ────────────────
    try {
        const cols = await qi.describeTable("users");
        if (!cols.duration) {
            await qi.addColumn("users", "duration", {
                type:         DataTypes.ENUM("monthly", "annually"),
                allowNull:    true,
                defaultValue: "monthly",
                comment:      "Billing cycle for the user's current plan",
            });
            console.log("✅  Added `duration` column to `users`");
        } else {
            console.log("ℹ️   `duration` column already exists on `users` — skipped");
        }
    } catch (err) {
        console.error("❌  Error adding `duration` column:", err.message);
    }

    // ── 2. Create `user_plans` table if it doesn't exist ─────────────────────
    try {
        await qi.createTable(
            "user_plans",
            {
                id: {
                    type:          DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey:    true,
                },
                userId: {
                    type:       DataTypes.INTEGER,
                    allowNull:  false,
                    references: { model: "users", key: "id" },
                    onDelete:   "CASCADE",
                },
                plan: {
                    type:      DataTypes.ENUM("free", "plus", "pro", "demo", "custom"),
                    allowNull: false,
                },
                duration: {
                    type:         DataTypes.ENUM("monthly", "annually"),
                    allowNull:    false,
                    defaultValue: "monthly",
                },
                companyLimit: {
                    type:         DataTypes.INTEGER,
                    allowNull:    false,
                    defaultValue: 1,
                },
                contactLimit: {
                    type:         DataTypes.INTEGER,
                    allowNull:    false,
                    defaultValue: 1,
                },
                reviewLimit: {
                    type:         DataTypes.INTEGER,
                    allowNull:    false,
                    defaultValue: 1,
                },
                startDate: {
                    type:         DataTypes.DATE,
                    allowNull:    false,
                    defaultValue: DataTypes.NOW,
                },
                endDate: {
                    type:      DataTypes.DATE,
                    allowNull: true,
                },
                status: {
                    type:         DataTypes.ENUM("active", "expired", "cancelled", "superseded"),
                    allowNull:    false,
                    defaultValue: "active",
                },
                assignedBy: {
                    type:      DataTypes.STRING,
                    allowNull: true,
                },
                previousPlan: {
                    type:      DataTypes.STRING,
                    allowNull: true,
                },
                notes: {
                    type:      DataTypes.TEXT,
                    allowNull: true,
                },
                createdAt: {
                    type:      DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                updatedAt: {
                    type:      DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
            },
            { ifNotExists: true }
        );
        console.log("✅  `user_plans` table ready");
    } catch (err) {
        console.error("❌  Error creating `user_plans` table:", err.message);
    }

    await sequelize.close();
    console.log("✅  Migration complete");
}

run();
