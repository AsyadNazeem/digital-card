import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AnalyticsSummary = sequelize.define('AnalyticsSummary', {
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
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    totalViews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalClicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    uniqueVisitors: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'analytics_summary',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['contactId', 'date']
        }
    ]
});

AnalyticsSummary.associate = (models) => {
    AnalyticsSummary.belongsTo(models.Contact, {
        foreignKey: 'contactId',
        as: 'Contact'
    });
};

export default AnalyticsSummary;
