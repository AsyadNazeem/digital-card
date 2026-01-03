// models/Contact.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Company from "./Company.js";

const Contact = sequelize.define(
    "Contact",
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
            onUpdate: "CASCADE"
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
            comment: "Associated company (optional)"
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "First name is required"
                },
                len: {
                    args: [1, 100],
                    msg: "First name must be between 1 and 100 characters"
                }
            }
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Last name is required"
                },
                len: {
                    args: [1, 100],
                    msg: "Last name must be between 1 and 100 characters"
                }
            }
        },
        telephone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate: {
                isValid(value) {
                    if (value && value.trim()) {
                        if (!/^\+\d{10,15}$/.test(value)) {
                            throw new Error("Telephone must be in E.164 format (e.g., +94771234567)");
                        }
                    }
                }
            },
            comment: "Optional phone number in E.164 format"
        },
        mobile: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: {
                args: true,
                msg: "This mobile number is already registered"
            },
            validate: {
                notEmpty: {
                    msg: "Mobile number is required"
                },
                isValid(value) {
                    if (!value || !value.trim()) {
                        throw new Error("Mobile number is required");
                    }
                    if (!/^\+\d{10,15}$/.test(value)) {
                        throw new Error("Mobile must be in E.164 format (e.g., +94771234567)");
                    }
                }
            },
            comment: "Required mobile number in E.164 format"
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Please provide a valid email address"
                },
                notEmpty: {
                    msg: "Email is required"
                }
            }
        },
        designation: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Designation is required"
                }
            },
            comment: "Job title or position"
        },
        photo: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: "Path to contact photo (e.g., /uploads/photos/filename.jpg)"
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            defaultValue: "active",
            allowNull: false
        },
        whatsapp: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate: {
                isValid(value) {
                    if (value && value.trim()) {
                        if (!/^\+\d{10,15}$/.test(value)) {
                            throw new Error("WhatsApp must be in E.164 format (e.g., +94771234567)");
                        }
                    }
                }
            },
            comment: "WhatsApp number in E.164 format (defaults to mobile if not provided)"
        },
        // ✅ NEW FIELD
        whatsappChannel: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isValidUrl(value) {
                    if (value && value.trim()) {
                        const urlPattern = /^https?:\/\/.+/i;
                        if (!urlPattern.test(value)) {
                            throw new Error("WhatsApp Channel must be a valid URL");
                        }
                    }
                }
            },
            comment: "WhatsApp Channel invite link"
        },
        cardMobileNum: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate: {
                isValid(value) {
                    if (value && value.trim()) {
                        if (!/^\+\d{10,15}$/.test(value)) {
                            throw new Error("Card Mobile must be in E.164 format");
                        }
                    }
                }
            },
            comment: "New card mobile number (defaults to mobile if checkbox is ON)"
        },
    },
    {
        tableName: "contacts",
        timestamps: true,
        indexes: [
            {
                fields: ["userId"]
            },
            {
                fields: ["companyId"]
            },
            {
                fields: ["mobile"],
                unique: true
            },
            {
                fields: ["status"]
            },
            {
                fields: ["firstName", "lastName"]
            },
            {
                name: "user_mobile_unique",
                unique: true,
                fields: ["userId", "mobile"]
            }
        ]
    }
);

// Relationships
User.hasMany(Contact, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "contacts"
});

Contact.belongsTo(User, {
    foreignKey: "userId",
    as: "owner"
});

Company.hasMany(Contact, {
    foreignKey: "companyId",
    onDelete: "SET NULL",
    as: "contacts"
});

Contact.belongsTo(Company, {
    foreignKey: "companyId",
    as: "Company"
});

export default Contact;
