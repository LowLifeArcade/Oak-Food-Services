const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true
  },
  content: {
    type: {},
    min: 5,
    max: 2000000
  },
  postedBy: {
    type: ObjectId,
    ref: 'User'
  }
}, {timestamps: true})

module.exports = mongoose.model('Teacher', teacherSchema)