import express from 'express';
import invoicesRoutes from './routes/invoices.routes.js';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/invoices', invoicesRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Invoicing API is running' });
});

export default app;
