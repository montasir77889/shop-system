import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]); // [{ productId, name, price, quantity, stock }]
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');
  const [lastInvoice, setLastInvoice] = useState(null);

  useEffect(() => { api.getProducts().then(setProducts).catch((e) => setError(e.message)); }, []);

  const addToCart = (product) => {
    setError('');
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product._id);
      if (existing) {
        if (existing.quantity + 1 > product.stock) return prev; // don't exceed stock
        return prev.map((c) => c.productId === product._id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      if (product.stock < 1) return prev;
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1, stock: product.stock }];
    });
  };

  const changeQty = (productId, qty) => {
    setCart((prev) => prev.map((c) => c.productId === productId ? { ...c, quantity: Math.max(1, Math.min(qty, c.stock)) } : c));
  };

  const removeFromCart = (productId) => setCart((prev) => prev.filter((c) => c.productId !== productId));

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const total = subtotal - Number(discount || 0) + Number(tax || 0);

  const checkout = async () => {
    setError('');
    if (cart.length === 0) return setError('Cart is empty');
    try {
      const invoice = await api.createInvoice({
        customerName: customerName || 'Walk-in Customer',
        items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity })),
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
        paymentMethod,
      });
      setLastInvoice(invoice);
      setCart([]);
      setCustomerName('');
      setDiscount(0);
      setTax(0);
      api.getProducts().then(setProducts); // refresh stock numbers
    } catch (e) {
      setError(e.message);
    }
  };
  const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <h1>Billing</h1>
      {error && <p className="error">{error}</p>}

      <div className="billing-layout">
        <div className="panel">
          <div className="panel-header">
            <h2>🛒 Products</h2>

            <input
              type="text"
              className="search-box"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="product-pick-list"></div>
          <div className="product-pick-list">
            {filteredProducts.map((p) => (
             <button 
              key={p._id}
              className="product-card"
              onClick={() => addToCart(p)}
              disabled={p.stock < 1}
             >
              <div className="product-info">
                <h3>{p.name}</h3>

                <p>Stock: {p.stock}</p>
              </div>

              <div className="product-price">
                <span>${p.price.toFixed(2)}</span>

                <div className="add-circle">+</div>
              </div>
             </button>
                  
            ))}
          </div>
        </div>

        <div className="receipt">
          <div className="receipt-header">
            <div className="receipt-title">RECEIPT</div>
            <input
              className="receipt-input"
              placeholder="Customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="receipt-items">
            {cart.length === 0 && <p className="empty">No items yet — click a product to add it.</p>}
            {cart.map((c) => (
              <div className="receipt-line" key={c.productId}>
                <span className="line-name">{c.name}</span>
                <input
                  className="qty-input"
                  type="number"
                  min="1"
                  max={c.stock}
                  value={c.quantity}
                  onChange={(e) => changeQty(c.productId, Number(e.target.value))}
                />
                <span className="mono">${(c.price * c.quantity).toFixed(2)}</span>
                <button className="remove-btn" onClick={() => removeFromCart(c.productId)}>×</button>
              </div>
            ))}
          </div>

          <div className="receipt-tear" />

          <div className="receipt-totals">
            <div className="totals-row"><span>Subtotal</span><span className="mono">${subtotal.toFixed(2)}</span></div>
            <div className="totals-row">
              <span>Discount</span>
              <input className="mini-input mono" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div className="totals-row">
              <span>Tax</span>
              <input className="mini-input mono" type="number" value={tax} onChange={(e) => setTax(e.target.value)} />
            </div>
            <div className="totals-row total"><span>TOTAL</span><span className="mono">${total.toFixed(2)}</span></div>
          </div>

          <select className="payment-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mobile">Mobile Payment</option>
          </select>

          <button className="btn-primary checkout-btn" onClick={checkout}>Complete Sale</button>
        </div>
      </div>

      {lastInvoice && (
        <div className="panel success-panel">
          <h2>✓ Invoice {lastInvoice.invoiceNumber} created</h2>
          <p>Total charged: <span className="mono">${lastInvoice.total.toFixed(2)}</span></p>
        </div>
      )}
    </div>
  );
}
