// models/Device.js

const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['on', 'off'], default: 'off' },
  settings: { type: mongoose.Schema.Types.Mixed },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
