// models/Review.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Company from "./Company.js";

const Review = sequelize.define(
    "Review",
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
            onUpdate: "CASCADE",
            comment: "Owner user who added this review/branch"
        },

        companyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "companies",
                key: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
            comment: "Optional associated company"
        },

        branchName: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: { msg: "Branch name is required" },
                len: { args: [1, 200], msg: "Branch name must be 1-200 characters" }
            }
        },

        location: {
            type: DataTypes.STRING(300),
            allowNull: true,
            comment: "Branch location (city, area, address)"
        },

        googleLink: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            validate: {
                isUrlOrEmpty(value) {
                    if (value && value.trim()) {
                        try {
                            new URL(value);
                        } catch {
                            throw new Error("googleLink must be a valid URL");
                        }
                    }
                }
            },
            comment: "Link to Google review / place"
        },

        tripadvisorLink: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            validate: {
                isUrlOrEmpty(value) {
                    if (value && value.trim()) {
                        try {
                            new URL(value);
                        } catch {
                            throw new Error("tripadvisorLink must be a valid URL");
                        }
                    }
                }
            },
            comment: "Tripadvisor link for the branch"
        },

        shareCode: {
            type: DataTypes.STRING(32),
            allowNull: true,
            unique: true,
            comment: "Public short code for shareable URL (e.g. r8x4K2bQ)"
        },


        status: {
            type: DataTypes.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active"
        }
    },
    {
        tableName: "reviews",
        timestamps: true,
        indexes: [
            { fields: ["userId"] },
            { fields: ["companyId"] },
            { fields: ["branchName"] },
            { fields: ["status"] },
            // Unique per user+company+branch to avoid exact duplicates
            { name: "user_company_branch_unique", unique: true, fields: ["userId", "companyId", "branchName"] }
        ],
    }
);

// Relationships
User.hasMany(Review, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "reviews"
});
Review.belongsTo(User, { foreignKey: "userId", as: "owner" });

Company.hasMany(Review, {
    foreignKey: "companyId",
    onDelete: "SET NULL",
    as: "reviews"
});
Review.belongsTo(Company, { foreignKey: "companyId", as: "Company" });

export default Review;
