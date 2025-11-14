// ============================================
// 1. UPDATED CONTACT MODEL (models/Contact.js)
// ============================================

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Company from "./Company.js";

const Contact = sequelize.define("Contact", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    // Personal Information
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Phone Numbers (stored in E.164 format, e.g., +94771234567)
    telephone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            isValid(value) {
                if (!value) return;
                if (!/^\+\d{10,15}$/.test(value)) {
                    throw new Error("Invalid telephone format. Must be in E.164 format.");
                }
            }
        }
    },

    mobile: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isValid(value) {
                if (!value) {
                    throw new Error("Mobile number is required.");
                }
                if (!/^\+\d{10,15}$/.test(value)) {
                    throw new Error("Invalid mobile format. Must be in E.164 format.");
                }
            }
        }
    },

    // Contact Information
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Address Fields
    country: {
        type: DataTypes.STRING(2), // ISO 3166-1 alpha-2 country code (e.g., "LK", "US")
        allowNull: true,
    },
    streetAddress: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    streetAddressLine2: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    postalCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    poBox: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    label: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Address label like 'Home', 'Work', 'Office', etc."
    },

    // Media
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Status
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
    },

    // Foreign Keys
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "Companies",
            key: "id",
        },
    },
});

// RELATIONSHIPS
User.hasMany(Contact, { foreignKey: "userId" });
Contact.belongsTo(User, { foreignKey: "userId" });

Company.hasMany(Contact, { foreignKey: "companyId" });
Contact.belongsTo(Company, { foreignKey: "companyId" });

export default Contact;
