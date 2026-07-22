# Invoicing Dashboard API

A RESTful API for managing invoices, built to automate a real-world workflow: cleaning, validating, and reporting on invoice data — the same process previously handled manually with Excel and CSV files in a pharmacy retail environment.

## About the project

This project models the backend of an invoicing system where a business can:

- Register invoices manually or in bulk via CSV upload
- Automatically calculate totals (subtotal + tax)
- Generate aggregated business reports (monthly revenue, revenue by product)
- Protect data-modifying actions behind user authentication

It was built as a hands-on way to apply real experience in data cleaning and ETL (previously done in Excel/VBA) using a modern backend stack.

## Tech stack

- **Node.js** + **Express** — REST API
- **PostgreSQL** — relational database
- **JWT (jsonwebtoken)** + **bcrypt** — authentication and password hashing
- **express-validator** — request validation
- **Multer** + **csv-parser** — CSV file upload and parsing

## Features

- ✅ Full CRUD for invoices
- ✅ Automatic calculation of `total_amount` (subtotal + tax)
- ✅ Request validation with field-specific error messages
- ✅ User registration and login with JWT-based authentication
- ✅ Protected routes — only authenticated users can create, delete, or bulk-upload invoices
- ✅ Bulk invoice upload via CSV file
- ✅ Aggregated reports: revenue by month, revenue by product

## Project structure

```markdown
```http
invoicing-dashboard/
├── src/
│   ├── config/
│   │   ├── db.js              # PostgreSQL connection pool
│   │   └── multer.js          # File upload configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── invoices.controller.js
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── validateInvoice.js # Request validation rules
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── invoices.routes.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in and receive a JWT token | No |

### Invoices

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `/api/invoices` | List all invoices | No |
| GET | `/api/invoices/:id` | Get a single invoice by id | No |
| POST | `/api/invoices` | Create a new invoice | Yes |
| DELETE | `/api/invoices/:id` | Delete an invoice | Yes |
| POST | `/api/invoices/upload` | Bulk upload invoices via CSV file | Yes |

### Reports

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `/api/invoices/reports/monthly` | Total revenue grouped by month | No |
| GET | `/api/invoices/reports/by-product` | Total revenue grouped by product | No |

## Getting started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/alfredo-alt/invoicing-dashboard.git
   cd invoicing-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables — copy `.env.example` to `.env` and fill in your own values:
   ```bash
   cp .env.example .env
   ```

4. Create the database and tables (see `Database schema` below)

5. Run the server
   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:3000`.

## Database schema

```sql
CREATE DATABASE invoicing_db;

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_date DATE NOT NULL,
    product VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    customer VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Example: creating an invoice

```markdown
```http
POST /api/invoices
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "invoice_date": "2026-07-01",
  "product": "Paracetamol 500mg",
  "category": "Medicine",
  "customer": "Farmacia Central",
  "quantity": 10,
  "subtotal": 50.00,
  "tax": 9.00
}
```

## Example: CSV upload format

```csv
invoice_date,product,category,customer,quantity,subtotal,tax
2026-07-10,Aspirina 100mg,Medicine,Farmacia Central,15,75.00,13.50
2026-07-11,Vitamina D,Supplement,Boticas Salud Norte,20,140.00,25.20
```

## Roadmap

- [ ] Update invoice endpoint (`PUT /api/invoices/:id`)
- [ ] React frontend: invoice table, creation form, and visual reports
- [ ] Deployment (backend on Render/Railway, frontend on Vercel)

## Author

**Alfredo Minchez**
Software Developer | SQL · JavaScript · ETL & Data Automation
[LinkedIn](https://www.linkedin.com/in/alfredo-minchez-242218156/)