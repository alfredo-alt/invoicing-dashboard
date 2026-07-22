const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
  getMonthlyReport,
  getProductReport,
  uploadInvoicesCSV,
} = require('../controllers/invoices.controller');
const {
  invoiceValidationRules,
  validate,
} = require('../middlewares/validateInvoice');
const verifyToken = require('../middlewares/authMiddleware');

// Public routes (no login required to view)
router.get('/reports/monthly', getMonthlyReport);
router.get('/reports/by-product', getProductReport);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);

// Protected routes (login required to modify data)
router.post('/', verifyToken, invoiceValidationRules, validate, createInvoice);
router.delete('/:id', verifyToken, deleteInvoice);
router.post('/upload', verifyToken, upload.single('file'), uploadInvoicesCSV);

module.exports = router;
