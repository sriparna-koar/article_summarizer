// routes/properties.js

const express = require('express');
const router = express.Router();
const Property = require('../models/property');

// Get all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new property
router.post('/', async (req, res) => {
    const property = new Property(req.body);
    try {
        const newProperty = await property.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add more routes as needed

module.exports = router;
