const mongoose = require("mongoose");

const tshirtDesignSchema = new mongoose.Schema({
  title: String,
  originalTopic: String,
  category: String,
  selectedModel: String,
  imagePrompt: String,
  imageUrl: String,
  tags: [String],
  mood: String,
  style: String,
  version: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TshirtDesign", tshirtDesignSchema);
