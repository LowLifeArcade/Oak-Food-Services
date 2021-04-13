const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    image: {
      url: String,
      key: String,
    },
    content: {
      type: {},
      // min: 5,
      max: 2000000,
    },
    menu: [
      {
        row1: {
          type: String,
        },
        row2: {
          type: String,
        },
        row3: {
          type: String,
        },
        row4: {
          type: String,
        },
      },
    ],
    pickupWeek: {
      type: String,
      trim: true,
      // required: true,
      max: 256,
    },
    group: {
      type: String,
    },
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
