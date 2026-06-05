// models/UserPlan.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserPlan = sequelize.define(
    "UserPlan",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onDelete: "CASCADE",
            comment: "Foreign key to users table",
        },

        planType: {
            type: DataTypes.ENUM("free", "plus", "pro", "demo", "custom"),
            allowNull: false,
            comment: "Subscribed plan name",
        },

        duration: {
            type: DataTypes.ENUM("monthly", "annually"),
            allowNull: false,
            defaultValue: "monthly",
            comment: "Billing cycle chosen by the admin",
        },

        companyLimit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: "Company limit set when this plan was assigned",
        },

        contactLimit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: "Contact limit set when this plan was assigned",
        },

        reviewLimit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: "Review limit set when this plan was assigned",
        },

        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: "Date/time when this plan became active",
        },

        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: "Calculated plan expiry: +30 days (monthly) or +365 days (annually). NULL for free/demo.",
        },

        // ── Status & audit ────────────────────────────────────────
        status: {
            type: DataTypes.ENUM("active", "expired", "cancelled", "superseded"),
            allowNull: false,
            defaultValue: "active",
            comment: "active = current plan; superseded = replaced by a newer plan row",
        },

        assignedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Admin username who assigned/changed this plan",
        },

        previousPlan: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "The plan the user was on before this change (for history/audit)",
        },

        paymentStatus: {
            type: DataTypes.ENUM(
                "pending",
                "paid",
                "failed",
                "refunded"
            ),
            defaultValue: "pending",
        },

        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "manual, stripe, payhere, paypal"
        },

        transactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        reminderSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        graceEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Optional admin notes about this plan assignment",
        },
    },
    {
        tableName: "user_plans",
        timestamps: true, // adds createdAt + updatedAt
        indexes: [
            { fields: ["userId"] },
            { fields: ["status"] },
            { fields: ["endDate"] },
        ],
    }
);

// Associations — wire these up in your models/index.js or wherever you define associations
UserPlan.associate = (models) => {
    UserPlan.belongsTo(models.User, {
        foreignKey: "userId",
        as: "User",
    });
};

export default UserPlan;
