import { Sequelize } from "sequelize";

const sequelize = new Sequelize("ecommerce", "root", "Saanvigup0312#", {
    host: "localhost",
    dialect: "mysql",
    logging: false, // optional: set to true to see raw SQL queries
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("DB Connected");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

export { sequelize };
export default connectDB;
