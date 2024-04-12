// backend/routes/sentimentRoutes.js

const express = require('express');
const router = express.Router();
const Sentiment = require('../models/Sentiment');
const sentiment = require('sentiment');

router.post('/analyze', async (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ message: "Text is required." });
    }

    try {
        const sentimentResult = sentiment(text);
        if (!sentimentResult || typeof sentimentResult.score === 'undefined') {
            throw new Error("Sentiment analysis failed.");
        }
        const score = sentimentResult.score;
        const sentimentData = new Sentiment({ text, score });
        await sentimentData.save();
        res.status(201).json({ sentiment: score });
    } catch (error) {
        console.error("Error analyzing sentiment:", error);
        return res.status(500).json({ message: "Error analyzing sentiment." });
    }
});

module.exports = router;
