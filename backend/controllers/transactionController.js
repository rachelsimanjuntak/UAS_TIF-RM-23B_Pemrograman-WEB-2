import db from '../config/db.js';

// GET 
export const getTransactions = async (req, res) => {
    try {
        const queryStr = `
            SELECT t.*, 
                   IF(p.id IS NULL, CONCAT(t.product_name_snapshot, ' (Produk telah dihapus)'), p.name) AS display_product_name
            FROM transactions t
            LEFT JOIN products p ON t.product_id = p.id
            ORDER BY t.transaction_date DESC
        `;
        const [rows] = await db.query(queryStr);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST 
export const createTransaction = async (req, res) => {
    const { customer_name, car_plate, product_id, quantity } = req.body;
    
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [product] = await connection.query('SELECT name, price, stock FROM products WHERE id = ?', [product_id]);
        
        if (product.length === 0) {
            return res.status(404).json({ message: 'Ban/Produk tidak ditemukan!' });
        }

        const productName = product[0].name;
        const currentStock = product[0].stock;
        const productPrice = product[0].price;

        if (currentStock < quantity) {
            return res.status(400).json({ message: 'Stok ban di bengkel tidak mencukupi!' });
        }

        const total_price = productPrice * quantity;

        const [insertResult] = await connection.query(
            'INSERT INTO transactions (customer_name, car_plate, product_id, product_name_snapshot, quantity, total_price) VALUES (?, ?, ?, ?, ?, ?)',
            [customer_name, car_plate, product_id, productName, quantity, total_price]
        );

        const newStock = currentStock - quantity;
        await connection.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, product_id]);

        await connection.commit();
        res.status(201).json({ id: insertResult.insertId, message: 'Transaksi berhasil dan stok ban diperbarui!' });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};