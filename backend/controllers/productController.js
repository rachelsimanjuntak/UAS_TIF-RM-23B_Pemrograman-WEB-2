import db from '../config/db.js';

// GET 
export const getProducts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST 
export const createProduct = async (req, res) => {
    const { sku, name, category, price, stock } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO products (sku, name, category, price, stock) VALUES (?, ?, ?, ?, ?)',
            [sku, name, category, price, stock]
        );
        res.status(201).json({ id: result.insertId, message: 'Produk berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT 
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { sku, name, category, price, stock } = req.body;
    try {
        await db.query(
            'UPDATE products SET sku=?, name=?, category=?, price=?, stock=? WHERE id=?',
            [sku, name, category, price, stock, id]
        );
        res.json({ message: 'Produk berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE 
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};