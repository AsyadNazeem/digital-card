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
                model: "users",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        heading: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "Company heading/tagline"
        },
        companyName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Company name is required"
                }
            }
        },
        website: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                isUrl: {
                    msg: "Please provide a valid URL"
                },
                notEmpty: {
                    msg: "Website is required"
                }
            }
        },
        displayUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "Friendly display URL (e.g., 'www.company.com')"
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
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Company biography/description"
        },
        logo: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: "Path to logo file (e.g., /uploads/logos/filename.jpg)"
        },
        view360: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: {
                    msg: "360 view must be a valid URL"
                }
            },
            comment: "URL to 360-degree view"
        },
        googleLocation: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: "Google Maps location URL"
        },
        googleReviews: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: "Google Reviews URL"
        },
        socialLinks: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: '{}',
            comment: "Social media links as JSON string (facebook, twitter, linkedin, etc.)",
            get() {
                const rawValue = this.getDataValue('socialLinks');
                if (!rawValue) return {};
                try {
                    return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
                } catch (e) {
                    console.error('Error parsing socialLinks:', e);
                    return {};
                }
            },
            set(value) {
                if (value === null || value === undefined) {
                    this.setDataValue('socialLinks', '{}');
                } else {
                    this.setDataValue('socialLinks', typeof value === 'string' ? value : JSON.stringify(value));
                }
            }
        },
        // ============================================
        // ADDRESS FIELDS (MOVED FROM CONTACT)
        // ============================================
        label: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: "Address label: Home, Work, Office, Other"
        },
        country: {
            type: DataTypes.STRING(2),
            allowNull: true,
            validate: {
                len: {
                    args: [2, 2],
                    msg: "Country code must be 2 characters (ISO 3166-1 alpha-2)"
                }
            },
            comment: "ISO 3166-1 alpha-2 country code (e.g., LK, US, GB)"
        },
        streetAddress: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "Primary street address"
        },
        streetAddressLine2: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "Apartment, suite, unit, building, floor, etc."
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: "City or locality"
        },
        postalCode: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: "ZIP or postal code"
        },
        poBox: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: "Post Office Box number"
        },
        // ============================================
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            defaultValue: "active",
            allowNull: false
        },
        tripAdvisor: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "Trip Advisor URL"
        },
    },
    {
        tableName: "companies",
        timestamps: true,
        indexes: [
            {
                fields: ["userId"]
            },
            {
                fields: ["status"]
            },
            {
                fields: ["companyName"]
            }
        ]
    }
);

// Relationships
User.hasMany(Company, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "companies"
});

Company.belongsTo(User, {
    foreignKey: "userId",
    as: "owner"
});


export default Company;
