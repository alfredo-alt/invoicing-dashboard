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
const { invoiceValidationRules, validate } = require('../middlewares/validateInvoice');

router.get('/reports/monthly', getMonthlyReport);
router.get('/reports/by-product', getProductReport);

router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.post('/', invoiceValidationRules, validate, createInvoice);
router.delete('/:id', deleteInvoice);

module.exports = router;