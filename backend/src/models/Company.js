import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Company = sequelize.define("Company", {
    heading: { type: DataTypes.STRING },
    companyName: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    displayUrl: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    logo: { type: DataTypes.STRING }, // image path
    view360: { type: DataTypes.STRING },
    googleLocation: { type: DataTypes.STRING },
    googleReviews: { type: DataTypes.STRING },
    socialLinks: { type: DataTypes.JSON }, // stores as JSON object
    status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
});

User.hasOne(Company, { foreignKey: "userId" });
Company.belongsTo(User, { foreignKey: "userId" });

export default Company;
