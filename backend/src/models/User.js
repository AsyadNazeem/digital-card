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
            allowNull: true,
            validate: {
                isValidPhone(value) {
                    if (value && value.trim() !== "") {
                        if (!/^[0-9+]+$/.test(value)) {
                            throw new Error("Telephone can contain only digits and + symbol.");
                        }
                    }
                },
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },

        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },

        provider: {
            type: DataTypes.STRING,
            defaultValue: "local",
        },

        status: {
            type: DataTypes.STRING,
            defaultValue: "active",
        },

        companyLimit: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },

        contactLimit: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },

        reviewLimit: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },

        role: {
            type: DataTypes.STRING,
            defaultValue: "user",
        },

        registrationType: {
            type: DataTypes.STRING,
            defaultValue: "self",
            comment:
                "self = user signup, admin = created by admin, google = Google OAuth",
        },

        selectedThemeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "themes",
                key: "id",
            },
        },

        plan: {
            type: DataTypes.ENUM("free", "premium", "enterprise"),
            defaultValue: "free",
        },

        // Add these fields to your User model definition
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "users",  // Add this line
        timestamps: true,
    }
);

// Important: associations must be defined later
User.associate = (models) => {
    User.belongsTo(models.Theme, {
        foreignKey: "selectedThemeId",
        as: "theme",
    });
};

export default User;
