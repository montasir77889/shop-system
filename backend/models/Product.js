const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true }, // unique product code
    category: { type: String, default: 'General' },
    price: { type: Number, required: true, min: 0 },      // selling price
    costPrice: { type: Number, default: 0, min: 0 },      // what you paid for it
    stock: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },       // warn when stock falls below this
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model('Product', productSchema);
