const User = require('../models/user');
const Link = require('../models/link');

exports.read = (req, res) => {
  User.findOne({ _id: req.user._id }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    Link.find({ postedBy: user })
      // .populate('categories', 'name slug')
      .populate('postedBy', 'name')
      .populate('mealRequest', 'mealRequest')
      .sort({ createdAt: -1 })
      .exec((err, mealRequest) => {
        if (err) {
          return res.status(400).json({
            error: 'Could not find links',
          });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        // console.log('user from user.js',user)
        res.json({ user, mealRequest });
        console.log(user)
      });
  });

  //   return res.json(req.profile);
};
// exports.read = (req, res) => {
//   User.findOne({ _id: req.user._id }).exec((err, user) => {
//     if (err) {
//       return res.status(400).json({
//         error: 'User not found',
//       });
//     }
//     Link.find({ postedBy: user })
//       .populate('categories', 'name slug')
//       .populate('postedBy', 'name')
//       .sort({ createdAt: -1 })
//       .exec((err, links) => {
//         if (err) {
//           return res.status(400).json({
//             error: 'Could not find links',
//           });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         // console.log('user from user.js',user)
//         res.json({ user, links });
//       });
//   });

//   //   return res.json(req.profile);
// };

exports.update = (req, res) => {
  const { name, password, categories, students } = req.body;
  switch (true) {
    case password && password.length < 8:
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters long' });
      break;
  }
  // add code to generate new password via salt and hash

  

  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, password, categories, students },
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

exports.addStudents = (req, res) => {
  const { students } = req.body;
  // switch (true) {
  //   case password && password.length < 8:
  //     return res
  //       .status(400)
  //       .json({ error: 'Password must be at least 8 characters long' });
  //     break;
  // }
  // add code to generate new password via salt and hash

  

  User.findOneAndUpdate(
    { _id: req.user._id },
    { students },
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
