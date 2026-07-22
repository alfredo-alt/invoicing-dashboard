const express = require('express');
const invoicesRoutes = require('./routes/invoices.routes');
const authRoutes = require('./routes/auth.routes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/invoices', invoicesRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Invoicing API is running' });
});

module.exports = app;
