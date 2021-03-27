const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const linkSchema = new mongoose.Schema(
  {
    mealRequest: [
      {
        meal: {
          type: String,
          trim: true,
          required: true,
          max: 256,
        },
        student: {
          type: ObjectId,
          ref: 'User',
        },
        complete: {
          type: Boolean,
          required: true,
          max: 256,
        },
        studentName: {
          type: String,
          trim: true,
          required: true,
          max: 256,
        },
        schoolName: {
          type: String,
          trim: true,
          required: true,
          max: 256,
        },
        lastName: {
          type: String,
          trim: true,
          required: true,
          max: 256,
        },
        group: {
          type: String,
          trim: true,
          max: 256,
        },
        teacher: {
          type: String,
          trim: true,
          max: 256,
        },
        pickupOption: {
          type: String,
          trim: true,
          required: true,
          max: 256,
        },
        foodAllergy: {
          peanuts: {
            type: Boolean,
          },
          treeNuts: {
            type: Boolean,
          },
          dairy: {
            type: Boolean,
          },
          gluten: {
            type: Boolean,
          },
          egg: {
            type: Boolean,
          },
          sesame: {
            type: Boolean,
          },
          soy: {
            type: Boolean,
          },
          seafood: {
            type: Boolean,
          },
        },
        parentEmail: {
          type: String,
          trim: true,
          required: true,
          max: 256,
        },
        parentName: {
          type: String,
          trim: true,
          required: true,
          max: 256,
        },
        individualPickupTime: {
          type: String,
          trim: true,
          max: 256,
        },
        postedBy: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
    orderStatus: {
      type: Boolean,
      required: false,
    },
    pickupTime: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    pickupDate: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    pickupCode: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    pickupCodeAdd: [
      {
        type: String,
        max: 256,
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Link', linkSchema);
