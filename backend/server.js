import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import connectDB, { sequelize } from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB & Cloudinary
await connectDB();         // Sequelize DB
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
    res.send('API Working');
});

// Start Server after syncing models
sequelize.sync({ alter: true }) // or force: true (for dev resets)
    .then(() => {
        app.listen(port, () => console.log('Server started on PORT:', port));
    })
    .catch(err => {
        console.error('DB Sync failed:', err);
    });
