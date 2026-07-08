import TopProducts from "./TopProducts";
import RevenueChart from "./RevenueChart";
import {
  FaDollarSign,
  FaBoxOpen,
  FaShoppingCart,
  FaExclamationTriangle,
  FaReceipt,
} 
from "react-icons/fa";
import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getSummary(), api.getLowStock()])
      .then(([s, low]) => {
        setSummary(s);
        setLowStock(low);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!summary)
  return (
    <p
      style={{
        textAlign: "center",
        fontSize: "18px",
        padding: "40px",
      }}
    >
      Loading Dashboard...
    </p>
  );


  return (
    <div>
      <div style={{marginBottom:"25px"}}>
        <h1>📊 ShopEase Dashboard</h1>

        <p style={{color:"#666",marginTop:"8px"}}>
          Welcome back! Here's an overview of your business today.
        </p>
      </div>
   
      <div className="card-grid">
        <div className="stat-card revenue">
          <FaDollarSign className="card-icon" />
          <div className="stat-label">Today's Revenue</div>
          <div className="stat-value">
            ${summary.todayRevenue.toFixed(2)}
          </div>
          <div className="stat-foot">
            {summary.todayInvoices} bills today
          </div>
        </div>
      

      <div className="stat-card total">
        <FaReceipt className="card-icon" />
        <div className="stat-label">Total Revenue</div>
        <div className="stat-value">
          ${summary.totalRevenue.toFixed(2)}
        </div>
        <div className="stat-foot">
          {summary.totalInvoices} total bills
        </div>
      </div>

      <div className="stat-card product">
        <FaBoxOpen className="card-icon" />
        <div className="stat-label">Products</div>
        <div className="stat-value">
          {summary.totalProducts}
        </div>
        <div className="stat-foot">
          Available in inventory
        </div>
      </div>

      <div className="stat-card warn">
        <FaExclamationTriangle className="card-icon" />
        <div className="stat-label">Low Stock</div>
        <div className="stat-value">
          {summary.lowStockCount}
        </div>
        <div className="stat-foot">
          Need restocking
        </div>
      </div>
      <div>
        <RevenueChart />
      </div>
      <div>
        <TopProducts />
      </div>
  </div>

      {lowStock.length > 0 && (
        <div className="panel">
          <h2>Low Stock Alerts</h2>
          <table>
            <thead>
              <tr><th>Product</th><th>SKU</th><th>Stock</th><th>Threshold</th></tr>
            </thead>
            <tbody>
              {lowStock.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td className="mono">{p.sku}</td>
                  <td className="mono">{p.stock}</td>
                  <td className="mono">{p.lowStockThreshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
