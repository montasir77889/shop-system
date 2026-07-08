const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

// GET /api/reports/summary - total revenue, invoice count, today's revenue
router.get('/summary', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [allInvoices, todayInvoices, lowStockCount, totalProducts] =await Promise.all([
    Invoice.find(),
    Invoice.find({ createdAt: { $gte: startOfToday } }),
    Product.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    }),
    Product.countDocuments(),
  ]);

    const totalRevenue = allInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const todayRevenue = todayInvoices.reduce((sum, inv) => sum + inv.total, 0);

    res.json({
      totalRevenue,
      totalInvoices: allInvoices.length,
      todayRevenue,
      todayInvoices: todayInvoices.length,
      lowStockCount,
      totalProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET /api/reports/revenue-chart
router.get("/revenue-chart", async (req, res) => {
  try {
    const today = new Date();

    const startDate = new Date();
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const sales = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          revenue: {
            $sum: "$total"
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);

    const revenueMap = {};

    sales.forEach(item => {
      revenueMap[item._id] = item.revenue;
    });

    const week = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dateKey = d.toISOString().split("T")[0];

      const dayName = d.toLocaleDateString("en-US", {
        weekday: "short"
      });

      week.push({
        day: dayName,
        revenue: revenueMap[dateKey] || 0
      });
    }

    res.json(week);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
// GET /api/reports/top-products - best sellers by quantity sold
router.get('/top-products', async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reports/low-stock - products at or below their threshold
router.get('/low-stock', async (req, res) => {
  try {
    const products = await Product.find({ $expr: { $lte: ['$stock', '$lowStockThreshold'] } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
