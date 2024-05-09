const mongoose = require('mongoose');

const cifarImageSchema = new mongoose.Schema({
  imageUrl: String,
  annotation:String,
  user: String,
});


module.exports = mongoose.model('cifarImages', cifarImageSchema);
