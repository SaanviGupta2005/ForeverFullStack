import { DataTypes } from "sequelize";
import { sequelize } from "../config/mongodb.js";

const UserModel = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cartData: {
        type: DataTypes.JSON, // Store object as JSON
        defaultValue: {},
    },
});

export default UserModel;
