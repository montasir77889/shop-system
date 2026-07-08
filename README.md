# Small Shop Inventory + Billing System (MERN)

A full MERN-stack app: **M**ongoDB + **E**xpress + **R**eact + **N**ode.

- Backend: Node.js + Express + Mongoose → REST API
- Frontend: React (Vite) → talks to the API
- Database: MongoDB

## Project structure

```
shop-system/
├── server.js              # Express app entry point
├── config/db.js           # MongoDB connection
├── models/                # Mongoose schemas (Product, Invoice)
├── routes/                # API endpoints (products, invoices, reports)
├── .env.example           # copy to .env and fill in
└── frontend/              # React app (Vite)
    └── src/
        ├── App.jsx
        ├── api.js          # fetch wrapper for calling the backend
        └── components/     # Dashboard, Inventory, Billing, Reports
```

## 1. Install MongoDB

Pick ONE:

**Option A — Local install:**
- Mac: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
- Windows/Linux: https://www.mongodb.com/try/download/community

**Option B — MongoDB Atlas (free cloud database, no install):**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free (M0) cluster
3. Create a database user + password
4. Click "Connect" → "Drivers" → copy the connection string
   (looks like `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/`)

## 2. Set up the backend

```bash
cd shop-system
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/shop_system
# or your Atlas connection string, with /shop_system added at the end
PORT=5000
```

Run it:
```bash
npm start
```
You should see:
```
MongoDB connected: ...
Server running on http://localhost:5000
```

Test it's alive: open http://localhost:5000/api/health in a browser → `{"status":"ok"}`

## 3. Set up the frontend

Open a **second terminal** (keep the backend running):

```bash
cd shop-system/frontend
npm install
npm run dev
```

Open http://localhost:3000 — you should see the app.

## 4. Using the app

1. **Inventory tab** → add your products (name, SKU, price, stock).
2. **Billing tab** → click products to add them to the receipt, adjust quantities, set discount/tax, choose payment method, click "Complete Sale". Stock reduces automatically.
3. **Dashboard** → shows today's revenue, total revenue, and low-stock alerts.
4. **Reports** → best-selling products and a log of all invoices.

## How the pieces talk to each other

```
React (localhost:3000)
   │  fetch('/api/products')
   ▼
Vite dev server proxies /api/* → http://localhost:5000
   ▼
Express (server.js) routes the request → routes/products.js
   ▼
Mongoose model (models/Product.js) reads/writes MongoDB
```

## Key API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/products | list products (supports ?search=) |
| POST | /api/products | add a product |
| PUT | /api/products/:id | edit a product |
| PATCH | /api/products/:id/stock | restock or adjust stock |
| DELETE | /api/products/:id | delete a product |
| GET | /api/invoices | list invoices |
| POST | /api/invoices | create a bill (auto-reduces stock) |
| GET | /api/reports/summary | revenue/invoice stats |
| GET | /api/reports/top-products | best sellers |
| GET | /api/reports/low-stock | products needing restock |

## Next steps you could add yourself

- User login (staff accounts) with JWT auth
- Printable/PDF invoice receipts
- Barcode scanning for checkout
- Supplier/purchase order tracking
- Deploy: backend to Render/Railway, frontend to Vercel/Netlify, DB on Atlas
