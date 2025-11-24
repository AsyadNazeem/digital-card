import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserPermission = sequelize.define('UserPermission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permission: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    grantedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_permissions',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'permission']
        }
    ]
});

export default UserPermission;
