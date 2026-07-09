// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Registrasi endpoint API resmi
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server Ottoban Bintaro berjalan di http://localhost:${PORT}`);
});