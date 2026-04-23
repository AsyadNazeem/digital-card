// models/Theme.js - UPDATED VERSION with layoutType
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Theme = sequelize.define(
    "Theme",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        previewImage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cssFile: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isPremium: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        // ============================================
        // NEW: LAYOUT TYPE FIELD
        // ============================================
        layoutType: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: 'classic',
            validate: {
                isIn: {
                    args: [['classic', 'modern', 'compact', 'minimal']],
                    msg: "Layout type must be: classic, modern, compact, or minimal"
                }
            },
            comment: "Layout type: classic (3x2 grid), modern (hero), compact, minimal"
        },
    },
    {
        tableName: "themes",
        timestamps: true,
    }
);

Theme.associate = (models) => {
    Theme.hasMany(models.User, { foreignKey: "selectedThemeId" });
};

export default Theme;
