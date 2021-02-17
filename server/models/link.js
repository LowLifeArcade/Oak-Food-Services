const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const linkSchema = new mongoose.Schema(
  {
    // OrderNumber: {
    //   type: ObjectId, // auto generate in sequence in database somehow
    // },
    // members: [{ firstName: String, lastName: String }]
// ,
    mealRequest: [
      { meal: {

        type: String,
        trim: true,
        required: true,
        max: 256
      }
      }
    ],
    pickupOption: {
      type: String,
      trim: true,
      required: true,
      max: 256
    },
    pickupTime: {
      type: String,
      trim: true,
      required: true,
      max: 256
    },
    pickupDate: {
      type: String,
      required: true,
      // unique: true
    },
    // title: {
    //   type: String,
    //   trim: true,
    //   required: false,
    //   max: 256,
    // },
    // url: {
    //   type: String,
    //   trim: true,
    //   required: false,
    //   max: 256,
    // },
    // slug: {
    //   type: String,
    //   lowercase: true,
    //   required: true,
    //   index: true,
    // },
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
    // categories: [
    //   {
    //     type: ObjectId,
    //     ref: 'Category',
    //     required: false
    //   }
    // ],
    // type: {
    //   type: String,
    //   default: 'Free',
    // },
    // medium: {
    //   type: String,
    //   default: 'Video',
    // },
    // clicks: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Link', linkSchema);
