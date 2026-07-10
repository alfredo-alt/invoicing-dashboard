const express = require('express');
const pool = require('./config/db');
const invoicesRoutes = require('./routes/invoices.routes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/invoices', invoicesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Invoicing API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});