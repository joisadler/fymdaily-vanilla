import mongoose from 'mongoose';

module.exports = mongoose.model('User', {
  id: String,
  username: String,
  password: String,
  email: String,
  bodyWeight: Number,
  height: Number,
  gender: String,
  waistCircumference: Number,
  neckCircumference: Number,
  hipCircumference: Number,
  physicalActivityLevel: String,
  goal: String,
});
