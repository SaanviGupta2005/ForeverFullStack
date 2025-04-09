import { DataTypes } from "sequelize";
import { sequelize } from "../config/mongodb.js";

const ProductModel = sequelize.define("Product", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    image: {
        type: DataTypes.JSON, // Store array as JSON
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subCategory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sizes: {
        type: DataTypes.JSON, // Array of sizes
        allowNull: false,
    },
    bestseller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    date: {
        type: DataTypes.DATE, // for Unix timestamp
        allowNull: false,
    },
});

export default ProductModel;
