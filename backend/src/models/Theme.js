// models/Theme.js
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
