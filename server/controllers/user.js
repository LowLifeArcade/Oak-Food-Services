const User = require('../models/user');
const Link = require('../models/link');

exports.read = (req, res) => {
  User.findOne({ _id: req.user._id })
    .populate({
      path: 'students',
    })
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'User not found',
        });
      }
      Link.find({ postedBy: user })
        .populate({
          path: 'postedBy',
          select:
            '-salt -hashed_password -pickupCodeAdd -categories -role -username -updatedAt -__v -_id',
          populate: {
            path: 'students',
          },
        })
        .sort({ createdAt: -1 })
        .exec((err, mealRequest) => {
          if (err) {
            return res.status(400).json({
              error: 'Could not find links',
            });
          }
          user.hashed_password = undefined;
          user.salt = undefined;
          res.json({ user, mealRequest });
          console.log(user);
        });
    });
};

exports.list = (req, res) => {
  User.find({})
    .select(
      '-salt -hashed_password -pickupCodeAdd -categories -role -username -createdAt -updatedAt -__v -_id'
    )
    .populate({
      path: 'mealRequest',
      populate: { path: '0', populate: { path: 'student' } },
    })
    .sort({ createdAt: -1 })
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Could not list users',
        });
      }
      res.json(data);
    });
};

exports.update = (req, res) => {
  const { name, lastName, email, students, special } = req.body;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, lastName, email, students, special },
    { new: true }
  ).exec((err, updated) => {
    if (err) {
      return res.status(400).json({
        error: 'problem updating user',
      });
    }
    console.log('update error', err);
    updated.hashed_password = undefined;
    updated.salt = undefined;
    res.json(updated);
  });
};

exports.addStudents = (req, res) => {
  const { students, special } = req.body;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { students, special },
    { new: true }
  ).exec((err, updated) => {
    if (err) {
      return res.status(400).json({
        error: 'Could not find user to update',
      });
    }
    updated.hashed_password = undefined;
    updated.salt = undefined;
    res.json(updated);
  });
};
