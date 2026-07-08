const BASE =
  import.meta.env.VITE_API_URL || "/api";

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  // Products
  getProducts: (search = '') =>
    fetch(`${BASE}/products${search ? `?search=${search}` : ''}`).then(handle),
  createProduct: (product) =>
    fetch(`${BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).then(handle),
  updateProduct: (id, product) =>
    fetch(`${BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).then(handle),
  adjustStock: (id, change) =>
    fetch(`${BASE}/products/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change }),
    }).then(handle),
  deleteProduct: (id) =>
    fetch(`${BASE}/products/${id}`, { method: 'DELETE' }).then(handle),

  // Invoices
  getInvoices: () => fetch(`${BASE}/invoices`).then(handle),
  createInvoice: (invoice) =>
    fetch(`${BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    }).then(handle),

// Reports
getSummary: () => fetch(`${BASE}/reports/summary`).then(handle),
getTopProducts: () => fetch(`${BASE}/reports/top-products`).then(handle),
getLowStock: () => fetch(`${BASE}/reports/low-stock`).then(handle),
getRevenueChart: () => fetch(`${BASE}/reports/revenue-chart`).then(handle),

// Authentication
register: (user) =>
  fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then(handle),

login: (user) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then(handle)
};