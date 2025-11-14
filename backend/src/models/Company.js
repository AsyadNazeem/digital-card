// models/Company.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Company = sequelize.define(
    "Company",
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
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        heading: DataTypes.STRING,
        companyName: DataTypes.STRING,
        website: DataTypes.STRING,
        displayUrl: DataTypes.STRING,
        email: DataTypes.STRING,
        bio: DataTypes.TEXT,
        logo: DataTypes.STRING,
        view360: DataTypes.STRING,
        googleLocation: DataTypes.STRING,
        googleReviews: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            defaultValue: "active",
        },
        socialLinks: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    }
);

// ✅ FIXED: One user can have MANY companies
User.hasMany(Company, { foreignKey: "userId", onDelete: "CASCADE" });
Company.belongsTo(User, { foreignKey: "userId" });

export default Company;
