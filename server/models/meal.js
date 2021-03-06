const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const mealSchema = new mongoose.Schema(
  {
    meal: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    student: {
      type: ObjectId,
      ref: 'User.students',
    },
    complete: {
      type: Boolean,
    },
    // postedBy: {
    //   type: ObjectId,
    //   ref: 'User',
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meal', mealSchema);
