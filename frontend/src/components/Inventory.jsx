import { useEffect, useState } from 'react';
import { api } from '../api.js';

const EMPTY_FORM = { name: '', sku: '', category: '', price: '', costPrice: '', stock: '', lowStockThreshold: 5 };

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const load = (q = '') => {
    api.getProducts(q).then(setProducts).catch((e) => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    load(e.target.value);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        costPrice: Number(form.costPrice) || 0,
        stock: Number(form.stock) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
      };
      if (editingId) {
        await api.updateProduct(editingId, payload);
      } else {
        await api.createProduct(payload);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      load(search);
    } catch (e) {
      setError(e.message);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, sku: p.sku, category: p.category,
      price: p.price, costPrice: p.costPrice, stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
    });
  };

  const restock = async (id, amount) => {
    try {
      await api.adjustStock(id, amount);
      load(search);
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      load(search);
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <h1>Inventory</h1>
      {error && <p className="error">{error}</p>}

      <div className="panel">
        <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
          <input name="sku" placeholder="SKU (unique code)" value={form.sku} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <input name="price" type="number" step="0.01" placeholder="Selling price" value={form.price} onChange={handleChange} required />
          <input name="costPrice" type="number" step="0.01" placeholder="Cost price" value={form.costPrice} onChange={handleChange} />
          <input name="stock" type="number" placeholder="Stock quantity" value={form.stock} onChange={handleChange} required />
          <input name="lowStockThreshold" type="number" placeholder="Low stock alert level" value={form.lowStockThreshold} onChange={handleChange} />
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editingId ? 'Save Changes' : 'Add Product'}</button>
            {editingId && (
              <button type="button" className="btn-ghost" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Products ({products.length})</h2>
          <input className="search-box" placeholder="Search by name or SKU…" value={search} onChange={handleSearch} />
        </div>
        <table>
          <thead>
            <tr><th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className={p.stock <= p.lowStockThreshold ? 'row-warn' : ''}>
                <td>{p.name}</td>
                <td className="mono">{p.sku}</td>
                <td>{p.category}</td>
                <td className="mono">${p.price.toFixed(2)}</td>
                <td className="mono">{p.stock}</td>
                <td className="actions">
                  <button className="btn-small" onClick={() => restock(p._id, 10)}>+10</button>
                  <button className="btn-small" onClick={() => restock(p._id, -1)}>-1</button>
                  <button className="btn-small" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn-small danger" onClick={() => remove(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
