import { body, validationResult } from 'express-validator';

const invoiceValidationRules = [
  body('invoice_date')
    .isDate()
    .withMessage('Invoice date must be a valid date'),
  body('product').trim().notEmpty().withMessage('Product name is required'),
  body('subtotal')
    .isFloat({ min: 0 })
    .withMessage('Subtotal must be a positive number'),
  body('tax').isFloat({ min: 0 }).withMessage('Tax must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { invoiceValidationRules, validate };
