import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT,
        logging: false, // disable SQL logs
    }
);

export default sequelize;



// #PORT=3306
// #DB_HOST=199.83.211.22
// #DB_USER=tapmyname_asyad
// #DB_PASS=]ZvkAE1v]{&-{k6M
//     #DB_NAME=tapmyname_tapmyname2
// #]ZvkAE1v]{&-{k6M
