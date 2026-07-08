const mongoose = require('mongoose');

// One line item inside an invoice (a product that was sold)
const invoiceItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },   // snapshot of product name at sale time
    price: { type: Number, required: true },  // snapshot of price at sale time
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerName: { type: String, default: 'Walk-in Customer' },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'mobile'], default: 'cash' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
