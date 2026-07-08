import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getSummary(), api.getTopProducts(), api.getInvoices()])
      .then(([s, top, inv]) => {
        setSummary(s);
        setTopProducts(top);
        setInvoices(inv);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!summary) return <p>Loading…</p>;

  return (
    <div>
      <h1>Reports</h1>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${summary.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Bills</div>
          <div className="stat-value">{summary.totalInvoices}</div>
        </div>
      </div>

      <div className="panel">
        <h2>Top Selling Products</h2>
        {topProducts.length === 0 ? (
          <p className="empty">No sales yet.</p>
        ) : (
          <table>
            <thead><tr><th>Product</th><th>Units Sold</th><th>Revenue</th></tr></thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p._id}</td>
                  <td className="mono">{p.totalQuantity}</td>
                  <td className="mono">${p.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <h2>Recent Invoices</h2>
        {invoices.length === 0 ? (
          <p className="empty">No invoices yet.</p>
        ) : (
          <table>
            <thead><tr><th>Invoice #</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th></tr></thead>
            <tbody>
              {invoices.slice(0, 15).map((inv) => (
                <tr key={inv._id}>
                  <td className="mono">{inv.invoiceNumber}</td>
                  <td>{inv.customerName}</td>
                  <td>{inv.items.length}</td>
                  <td className="mono">${inv.total.toFixed(2)}</td>
                  <td>{new Date(inv.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
