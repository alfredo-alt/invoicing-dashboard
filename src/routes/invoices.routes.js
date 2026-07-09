const express = require('express');
const router = express.Router();
const {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
} = require('../controllers/invoices.controller');

router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoice);
router.delete('/:id', deleteInvoice);

module.exports = router;