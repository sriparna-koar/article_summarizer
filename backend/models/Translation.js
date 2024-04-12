// models/Translation.js
const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  text: String,
  sourceLanguage: String,
  targetLanguage: String,
  translatedText: String,
  createdAt: Date,
});

module.exports = mongoose.model('Translation', translationSchema);
