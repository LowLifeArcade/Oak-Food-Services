const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;

const studentSchema = new mongoose.Schema(
  {
    name: {
      name: String,
      required: true,
    },
    school: {
      schoolName: String,
      required: true,
    },
    group: {
      type: ObjectId,
      ref: 'Group',
      required: true,
    },
    teacher:{
      type: ObjectId,
      ref: 'Teacher',
      required: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Student', studentSchema);
