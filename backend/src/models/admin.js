import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Admin = sequelize.define("Admin", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    },
    role: { // ADD THIS
        type: DataTypes.ENUM('super_admin', 'admin'),
        defaultValue: 'admin',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("active","inactive"),
        defaultValue: "active"
    }
}, {
    tableName: "admins",
    timestamps: true
});

export default Admin;
