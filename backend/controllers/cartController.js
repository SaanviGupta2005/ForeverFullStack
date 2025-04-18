import userModel from "../models/userModel.js";

// Add product to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;

        const user = await userModel.findByPk(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        let cartData = user.cartData || {};

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await user.update({ cartData });

        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update quantity of an item in user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const user = await userModel.findByPk(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        let cartData = user.cartData || {};

        if (!cartData[itemId]) cartData[itemId] = {};
        cartData[itemId][size] = quantity;

        await user.update({ cartData });

        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findByPk(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        const cartData = user.cartData || {};

        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };
