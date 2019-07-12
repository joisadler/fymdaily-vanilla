import mongoose from 'mongoose';

const findOrCreate = require('mongoose-findorcreate');

const FoodSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: false },
  calories: { type: String, required: true },
  proteins: { type: String, required: true },
  fats: { type: String, required: true },
  carbs: { type: String, required: true },
});
FoodSchema.plugin(findOrCreate);

export default mongoose.model('Food', FoodSchema);
