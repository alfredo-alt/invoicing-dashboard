import { getInvoiceById } from '../invoices.controller.js';
import pool from '../../config/db.js';

jest.mock('../../config/db');

describe('getInvoiceById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the invoice when found', async () => {
    const mockInvoice = {
      id: 1,
      product: 'Paracetamol 500mg',
      total_amount: 59.0,
    };
    pool.query.mockResolvedValue({ rows: [mockInvoice] });

    const req = { params: { id: '1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getInvoiceById(req, res);

    expect(res.json).toHaveBeenCalledWith(mockInvoice);
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it('should return 404 when the invoice does not exist', async () => {
    pool.query.mockResolvedValue({ rows: [] }); // simulate: nothing found

    const req = { params: { id: '9999' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getInvoiceById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invoice not found' });
  });
});
