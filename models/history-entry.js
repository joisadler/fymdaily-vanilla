import mongoose from 'mongoose';

const findOrCreate = require('mongoose-find-or-create');

const HistoryEntrySchema = new mongoose.Schema({
  userId: String,
  date: String,
  products: [
    {
      _id: false,
      name: String,
      weight: Number,
      calories: Number,
      proteins: Number,
      fats: Number,
      carbs: Number,
    },
  ]
});
HistoryEntrySchema.plugin(findOrCreate);

export default mongoose.model('HistoryEntry', HistoryEntrySchema);

// module.exports = mongoose.model('HistoryEntry', {
//   userId: String,
//   date: String,
//   products: [
//     {
//       _id: false,
//       name: String,
//       weight: Number
//     },
//   ]
// });


// module.exports = mongoose.model('HistoryEntry', {
//   userId: String,
//   date: String,
//   products: [
//     {
//       _id: false,
//       name: String,
//       weight: Number
//     },
//   ]
// });
