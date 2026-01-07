import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ContactCardClick = sequelize.define('ContactCardClick', {
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
    clickType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'phone, email, whatsapp, website, social_facebook, etc.'
    },
    linkUrl: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ipAddress: {
        type: DataTypes.STRING(45),
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
    deviceType: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    browser: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    os: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    gaClientId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Google Analytics Client ID for correlation'
    }
}, {
    tableName: 'contact_card_clicks',
    timestamps: true,
    createdAt: 'clickedAt',
    updatedAt: false
});

ContactCardClick.associate = (models) => {
    ContactCardClick.belongsTo(models.Contact, {
        foreignKey: 'contactId',
        as: 'Contact'
    });
};

export default ContactCardClick;
