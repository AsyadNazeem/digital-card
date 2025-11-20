import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Admin = sequelize.define("Admin", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM("active","inactive"), defaultValue: "active" }
}, {
    tableName: "admins",  // ✅ Changed from "Admins" to "admins"
    timestamps: true
});

export default Admin;
