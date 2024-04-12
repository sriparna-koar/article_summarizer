// routes/deviceRoutes.js

const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update device status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Device.findByIdAndUpdate(id, { status });
    res.json({ message: 'Device status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
