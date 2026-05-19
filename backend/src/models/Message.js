import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";
import User from "./User.js";

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    // ✅ ADD THIS: Track which user submitted the form
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // null for anonymous submissions
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    senderName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    senderEmail: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    messageType: {
        type: DataTypes.ENUM('contact', 'plan_upgrade', 'plan_downgrade', 'support'),
        defaultValue: 'contact'
    },
    // Optional: Store plan change context
    planRequest: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Stores {from: "free", to: "plus"} for plan change requests'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'messages',
    timestamps: true,
    indexes: [
        { fields: ['isRead', 'createdAt'] },
        { fields: ['senderEmail'] },
        { fields: ['userId'] }  // ✅ ADD INDEX for filtering by user
    ]
});

// ✅ Optional: Set up association if needed
Message.belongsTo(User, { foreignKey: 'userId', as: 'User' });

export default Message;
