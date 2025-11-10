import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Contact = sequelize.define("Contact", {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    telephone: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    designation: { type: DataTypes.STRING },
    company: { type: DataTypes.STRING },
    photo: { type: DataTypes.STRING }, // image path
    status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
});

User.hasMany(Contact, { foreignKey: "userId" });
Contact.belongsTo(User, { foreignKey: "userId" });

export default Contact;
