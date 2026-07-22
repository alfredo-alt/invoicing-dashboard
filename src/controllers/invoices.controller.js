import fs from 'fs';
import pool from '../config/db.js';
import csv from 'csv-parser';

const uploadInvoicesCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const errors = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', async () => {
      let insertedCount = 0;

      for (const row of results) {
        try {
          const {
            invoice_date,
            product,
            category,
            customer,
            quantity,
            subtotal,
            tax,
          } = row;
          const total_amount = parseFloat(subtotal) + parseFloat(tax);

          await pool.query(
            `INSERT INTO invoices 
              (invoice_date, product, category, customer, quantity, subtotal, tax, total_amount)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              invoice_date,
              product,
              category,
              customer,
              quantity || 1,
              subtotal,
              tax,
              total_amount,
            ],
          );
          insertedCount++;
        } catch (error) {
          errors.push({ row, error: error.message });
        }
      }

      // Clean up: delete the temporary file after processing
      fs.unlinkSync(req.file.path);

      res.status(201).json({
        message: `${insertedCount} invoices uploaded successfully`,
        totalRows: results.length,
        errors: errors.length > 0 ? errors : undefined,
      });
    });
};

// GET all invoices
const getAllInvoices = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invoices ORDER BY invoice_date DESC',
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

// GET single invoice by id
const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM invoices WHERE id = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};

// POST create a new invoice
const createInvoice = async (req, res) => {
  const { invoice_date, product, category, customer, quantity, subtotal, tax } =
    req.body;
  const total_amount = parseFloat(subtotal) + parseFloat(tax);

  try {
    const result = await pool.query(
      `INSERT INTO invoices 
        (invoice_date, product, category, customer, quantity, subtotal, tax, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        invoice_date,
        product,
        category,
        customer,
        quantity || 1,
        subtotal,
        tax,
        total_amount,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

// DELETE an invoice
const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM invoices WHERE id = $1 RETURNING *',
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};

// GET summary report: totals by month
const getMonthlyReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(invoice_date, 'YYYY-MM') AS month,
        COUNT(*) AS invoice_count,
        SUM(subtotal) AS total_subtotal,
        SUM(tax) AS total_tax,
        SUM(total_amount) AS total_revenue
      FROM invoices
      GROUP BY TO_CHAR(invoice_date, 'YYYY-MM')
      ORDER BY month DESC
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to generate monthly report' });
  }
};

// GET summary report: totals by product
const getProductReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        product,
        category,
        COUNT(*) AS times_sold,
        SUM(quantity) AS total_quantity,
        SUM(total_amount) AS total_revenue
      FROM invoices
      GROUP BY product, category
      ORDER BY total_revenue DESC
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to generate product report' });
  }
};

export {
  getAllInvoices,
  getInvoiceById,
  getMonthlyReport,
  getProductReport,
  createInvoice,
  deleteInvoice,
  uploadInvoicesCSV,
};
