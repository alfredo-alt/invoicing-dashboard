const express = require('express');
const router = express.Router();
const {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
  getMonthlyReport,
  getProductReport,
} = require('../controllers/invoices.controller');

// Reports (must go BEFORE /:id to avoid route conflicts)
router.get('/reports/monthly', getMonthlyReport);
router.get('/reports/by-product', getProductReport);

router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoice);
router.delete('/:id', deleteInvoice);

module.exports = router;