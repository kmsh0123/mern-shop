import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1d' } // Automatically remove tokens after 1 day
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

export default TokenBlacklist;