const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

// GET /api/invoices - list all invoices (most recent first)
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/invoices/:id - single invoice (for printing a receipt)
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/invoices - create a new bill
// body: { customerName, items: [{ productId, quantity }], discount, tax, paymentMethod }
router.post('/', async (req, res) => {
  try {
    const { customerName, items, discount = 0, tax = 0, paymentMethod = 'cash' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Invoice must have at least one item' });
    }

    const invoiceItems = [];
    let subtotal = 0;

    // Step A: validate stock and build line items
    for (const line of items) {
      const product = await Product.findById(line.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${line.productId}` });
      if (product.stock < line.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
      }

      const lineSubtotal = product.price * line.quantity;
      subtotal += lineSubtotal;

      invoiceItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: line.quantity,
        subtotal: lineSubtotal,
      });
    }

    const total = subtotal - Number(discount) + Number(tax);

    // Step B: generate a simple sequential invoice number, e.g. INV-000001
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;

    // Step C: create the invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      items: invoiceItems,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod,
    });

    // Step D: reduce stock for every product sold
    for (const line of items) {
      await Product.findByIdAndUpdate(line.productId, { $inc: { stock: -line.quantity } });
    }

    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
