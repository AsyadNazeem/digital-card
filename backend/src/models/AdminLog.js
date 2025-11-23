import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AdminLog = sequelize.define("AdminLog", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'admins',
            key: 'id'
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of action performed (e.g., LOGIN, CREATE_USER, UPDATE_USER, DELETE_USER, APPROVE_REQUEST, etc.)'
    },
    targetType: {
        type: DataTypes.ENUM('user', 'company', 'contact', 'request', 'admin', 'system'),
        allowNull: true,
        comment: 'Type of entity affected by the action'
    },
    targetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the affected entity'
    },
    targetName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Name/identifier of the affected entity for quick reference'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Human-readable description of the action'
    },
    changes: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON object containing before/after values for updates'
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('success', 'failed', 'partial'),
        defaultValue: 'success'
    },
    errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Error message if action failed'
    }
}, {
    tableName: "admin_logs",
    timestamps: true,
    updatedAt: false, // Logs should not be updated
    indexes: [
        { fields: ['adminId'] },
        { fields: ['action'] },
        { fields: ['targetType', 'targetId'] },
        { fields: ['createdAt'] }
    ]
});

// Define association method
AdminLog.associate = (models) => {
    AdminLog.belongsTo(models.Admin, {
        foreignKey: 'adminId',
        as: 'Admin'
    });
};

export default AdminLog;
