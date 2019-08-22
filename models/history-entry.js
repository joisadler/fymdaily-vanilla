import mongoose from 'mongoose';

const findOrCreate = require('mongoose-find-or-create');

const HistoryEntrySchema = new mongoose.Schema({
  userId: String,
  date: String,
  products: [
    {
      _id: false,
      name: String,
      brand: String,
      weight: Number,
      calories: Number,
      proteins: Number,
      fats: Number,
      carbs: Number,
    },
  ],
  info: {
    _id: false,
    bodyWeight: Number,
    height: Number,
    gender: String,
    waistCircumference: Number,
    neckCircumference: Number,
    hipCircumference: Number,
    physicalActivityLevel: String,
    goal: String,
  }
});
HistoryEntrySchema.plugin(findOrCreate);

export default mongoose.model('HistoryEntry', HistoryEntrySchema);
