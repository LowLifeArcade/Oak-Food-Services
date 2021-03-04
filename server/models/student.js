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

// // virtual fields
// userSchema
//   .virtual('password')
//   .set(function (password) {
//     // create temp var called _password
//     this._password = password;
//     // generate salt
//     this.salt = this.makeSalt();
//     // encrypt password
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });
// // methods > authenticate, encryptPassword, makeSalt
// userSchema.methods = {
//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },

//   encryptPassword: function (password) {
//     if (!password) return '';
//     try {
//       return crypto
//         .createHmac('sha1', this.salt) // possible algorithm problem RS256 might have to go here instead of sha1
//         .update(password)
//         .digest('hex');
//       console.log(hash);
//     } catch (err) {
//       return '';
//     }
//   },

//   makeSalt: function () {
//     return Math.round(new Date().valueOf() * Math.random() + '');
//   },
// };
// // export user model

module.exports = mongoose.model('Student', studentSchema);
