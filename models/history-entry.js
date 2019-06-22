import mongoose from 'mongoose';

module.exports = mongoose.model('HistoryEntry', {
  userId: String,
  date: String,
  products: [
    {
      _id: false,
      name: String,
      weight: Number
    },
  ]
});
