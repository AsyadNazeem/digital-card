import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PermissionChange = sequelize.define('PermissionChange', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    targetUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    targetUsername: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    permission: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM('granted', 'revoked'),
        allowNull: false
    },
    changedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'permission_changes',
    timestamps: false
});

export default PermissionChange;
