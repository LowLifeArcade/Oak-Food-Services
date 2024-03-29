const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 4,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: 'subscriber',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
    students: [
      {
        name: {
          type: String,
          required: true,
        },
        schoolName: {
          type: String,
          required: true,
        },
        group: {
          type: String,
          required: true,
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
        teacher: {
          type: String,
          // required: true
        },
        age: {
          type: String,
        },
      },
    ],
    special: {
      sendEmail: {
        type: {},
      },
      gfplus: {
        type: {},
      },
      vgplus: {
        type: {},
      },
      twothree: {
        type: {},
      },
    },
    categories: [
      {
        type: ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    userCode: {
      type: String,
      required: true,
      max: 32,
    },
  },
  { timestamps: true }
);

// virtual fields
userSchema
  .virtual('password')
  .set(function (password) {
    // create temp var called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });
// methods > authenticate, encryptPassword, makeSalt
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha256', this.salt) // possible algorithm problem RS256 might have to go here instead or bcrypt
        .update(password)
        .digest('hex');
      console.log(hash);
    } catch (err) {
      return '';
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random() + '');
  },
};

module.exports = mongoose.model('User', userSchema);
