const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - list all products (optional ?search=term)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { sku: new RegExp(search, 'i') }] }
      : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - add a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message }); // e.g. duplicate SKU
  }
});

// PUT /api/products/:id - edit a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,          // return the updated doc
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/products/:id/stock - adjust stock (restock or manual correction)
router.patch('/:id/stock', async (req, res) => {
  try {
    const { change } = req.body; // e.g. +10 to restock, -2 to remove damaged stock
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.stock += Number(change);
    if (product.stock < 0) return res.status(400).json({ message: 'Stock cannot go below 0' });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
