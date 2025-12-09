import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Request = sequelize.define(
    "Request",
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
                model: "users",  // ✅ Changed from User to "users"
                key: "id",
            },
            onDelete: "CASCADE",
        },
        requestedCompanies: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        requestedContacts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        requestedReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("pending", "approved", "rejected"),
            defaultValue: "pending",
        },
    },
    {
        timestamps: true,
        tableName: "requests", // ✅ Changed from "Requests" to "requests"
    }
);



// ✅ Define association
User.hasMany(Request, { foreignKey: "userId", onDelete: "CASCADE" });
Request.belongsTo(User, { foreignKey: "userId" });

export default Request;
