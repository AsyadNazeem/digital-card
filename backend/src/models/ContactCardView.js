import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ContactCardView = sequelize.define('ContactCardView', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contactId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'contacts',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    countryCode: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    region: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    referrer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    deviceType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'mobile, desktop, tablet'
    },
    browser: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    os: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    screenResolution: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    language: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    gaClientId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Google Analytics Client ID for correlation'
    }
}, {
    tableName: 'contact_card_views',
    timestamps: true,
    createdAt: 'viewedAt',
    updatedAt: false
});

ContactCardView.associate = (models) => {
    ContactCardView.belongsTo(models.Contact, {
        foreignKey: 'contactId',
        as: 'Contact'
    });
};

export default ContactCardView;
