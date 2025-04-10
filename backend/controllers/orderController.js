import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sendOrderMail from '../utils/sendOrderMail.js';
import Stripe from "stripe";
import Razorpay from "razorpay";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const currency = "inr";
const deliveryCharge = 10;

// Place order - COD
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: new Date(),
        };

        const newOrder = await orderModel.create(orderData);
        await userModel.update({ cartData: {} }, { where: { id: userId } });

        const user = await userModel.findOne({ where: { id: userId } });

        // Send Email
        if (user) {
            await sendOrderMail(user.email, user.name || "Customer", {
                id: newOrder.id,
                items,
                address,
                amount,
                paymentMethod: "COD",
            });
        }

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Place order - Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const newOrder = await orderModel.create({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: new Date(),
        });

        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency,
                product_data: { name: "Delivery Charges" },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: `${origin}/verify?success=true&orderId=${newOrder.id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder.id}`,
            line_items,
            mode: "payment",
            billing_address_collection: "required",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            await orderModel.update({ payment: true }, { where: { id: orderId } });
            await userModel.update({ cartData: {} }, { where: { id: userId } });

            const order = await orderModel.findOne({ where: { id: orderId } });
            const user = await userModel.findOne({ where: { id: userId } });

            if (order && user) {
                await sendOrderMail(user.email, user.name || "Customer", {
                    id: order.id,
                    items: order.items,
                    address: order.address,
                    amount: order.amount,
                    paymentMethod: "Stripe",
                });
            }

            res.json({ success: true });
        } else {
            await orderModel.destroy({ where: { id: orderId } });
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Place order - Razorpay
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const newOrder = await orderModel.create({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: new Date(),
        });

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder.id.toString(),
        };

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === "paid") {
            await orderModel.update({ payment: true }, { where: { id: orderInfo.receipt } });
            await userModel.update({ cartData: {} }, { where: { id: userId } });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Fetch all orders
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.findAll();
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User: Fetch orders
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.findAll({ where: { userId } });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Update order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.update({ status }, { where: { id: orderId } });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    placeOrder,
    placeOrderStripe,
    verifyStripe,
    placeOrderRazorpay,
    verifyRazorpay,
    allOrders,
    userOrders,
    updateStatus,
};
