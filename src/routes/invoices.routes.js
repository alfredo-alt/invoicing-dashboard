import express from 'express';
import upload from '../config/multer.js';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
  getMonthlyReport,
  getProductReport,
  uploadInvoicesCSV,
} from '../controllers/invoices.controller.js';
import {
  invoiceValidationRules,
  validate,
} from '../middlewares/validateInvoice.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (no login required to view)
router.get('/reports/monthly', getMonthlyReport);
router.get('/reports/by-product', getProductReport);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);

// Protected routes (login required to modify data)
router.post('/', verifyToken, invoiceValidationRules, validate, createInvoice);
router.delete('/:id', verifyToken, deleteInvoice);
router.post('/upload', verifyToken, upload.single('file'), uploadInvoicesCSV);

export default router;
