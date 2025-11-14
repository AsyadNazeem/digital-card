// models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        countryCode: {
            type: DataTypes.STRING(5),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,  // ✅ Allow null
            validate: {
                // ✅ FIXED: Only validate if phone is provided and not empty
                isValidPhone(value) {
                    if (value && value.trim() !== '') {
                        if (!/^[0-9+]+$/.test(value)) {
                            throw new Error("Telephone can contain only digits and + symbol.");
                        }
                    }
                }
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,  // ✅ Allow null for Google users
            defaultValue: null,
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "local", // 'local' or 'google'
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "active",
        },
        companyLimit: { type: DataTypes.INTEGER, defaultValue: 1 },
        contactLimit: { type: DataTypes.INTEGER, defaultValue: 1 },
        role: { type: DataTypes.STRING, defaultValue: "user" },
    },
    {
        timestamps: true,
    }
);

export default User;
