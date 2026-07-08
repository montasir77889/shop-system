import { useEffect, useState } from "react";
import { api } from "../api";

export default function TopProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getTopProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="panel">
      <h2>🏆 Top Selling Products</h2>

      {products.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.totalQuantity}</td>
                <td>${item.totalRevenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}