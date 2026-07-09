const pool = require('../config/db');

// GET all invoices
const getAllInvoices = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invoices ORDER BY invoice_date DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

// GET single invoice by id
const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};

// POST create a new invoice
const createInvoice = async (req, res) => {
  const { invoice_date, product, category, customer, quantity, subtotal, tax } = req.body;

  // Basic validation
  if (!invoice_date || !product || !subtotal || !tax) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const total_amount = parseFloat(subtotal) + parseFloat(tax);

  try {
    const result = await pool.query(
      `INSERT INTO invoices 
        (invoice_date, product, category, customer, quantity, subtotal, tax, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [invoice_date, product, category, customer, quantity || 1, subtotal, tax, total_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

// DELETE an invoice
const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM invoices WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
};