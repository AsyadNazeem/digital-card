import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Contact = sequelize.define("Contact", {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    telephoneCountryCode: DataTypes.STRING(6),
    telephone: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
            is: /^[0-9]{10}$/, // Only 10 digits
        },
    },
    mobileCountryCode: DataTypes.STRING(6),
    mobile: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
            is: /^[0-9]{10}$/, // Only 10 digits
        },
    },
    email: { type: DataTypes.STRING },
    designation: { type: DataTypes.STRING },
    company: { type: DataTypes.STRING },
    photo: { type: DataTypes.STRING }, // image path
    status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
});

User.hasMany(Contact, { foreignKey: "userId" });
Contact.belongsTo(User, { foreignKey: "userId" });

export default Contact;
