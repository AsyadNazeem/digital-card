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
        phone: {
            type: DataTypes.STRING,
            allowNull: true,  // ✅ Allow null for Google users
            defaultValue: "",
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,  // ✅ CRITICAL: Allow null for Google users
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
    },
    {
        timestamps: true,
    }
);

export default User;
