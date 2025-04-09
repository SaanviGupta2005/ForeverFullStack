import { DataTypes } from "sequelize";
import { sequelize } from "../config/mongodb.js";

const OrderModel = sequelize.define("Order", {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    items: {
        type: DataTypes.JSON, // Store items array
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    address: {
        type: DataTypes.JSON, // Object address
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Order Placed",
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

export default OrderModel;
