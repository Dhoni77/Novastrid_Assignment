import { Sequelize } from "sequelize-typescript";
import User from "./models/User";
import ChatHistory from "./models/Chat";

const sequelize = new Sequelize(
    'assignment',
    'root',
    'root',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: true,
        models: [User, ChatHistory]
    }
);

async function init() {
    await sequelize.authenticate().then(async () => {
        console.log('Connection has been established successfully.');

        // Sync all defined models to the DB
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });
}

init();

export default sequelize;