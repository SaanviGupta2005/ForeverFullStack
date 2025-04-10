import nodemailer from "nodemailer";

const sendOrderMail = async (toEmail, userName, orderDetails) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use custom SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const itemList = orderDetails.items.map(
            (item) => `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`
        ).join("<br>");

        const mailOptions = {
            from: `"Forever" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "🎉 Order Placed Successfully!",
            html: `
                <h2>Hi ${userName},</h2>
                <p>Thank you for your order! Here are your order details:</p>
                <p><strong>Order ID:</strong> ${orderDetails.id}</p>
                <p><strong>Items:</strong><br>${itemList}</p>
                <p><strong>Total Amount:</strong> ₹${orderDetails.amount}</p>
                <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
                <br>
                <p>We’ll notify you once your order is shipped.</p>
                <p>Thank you for shopping with us!</p>
                <p>- Forever Team</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Order confirmation email sent to:", toEmail);
    } catch (error) {
        console.error("❌ Failed to send order mail:", error.message);
    }
};

export default sendOrderMail;
