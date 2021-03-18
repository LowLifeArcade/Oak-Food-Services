const Link = require('../models/link');
const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {
  registerEmailParams,
  forgotPasswordEmailParams,
} = require('../helpers/email');
const shortId = require('shortid');
const _ = require('lodash');
const slugify = require('slugify');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
  // console.log('REGISTER CONTROLLER', req.body);\
  const { name, lastName, email, password, students } = req.body;
  // check if user exits
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      console.log(err);
      return res.status(400).json({
        error: 'Email is taken',
      });
    }

    // generate userCode
    // if (!userCode) {
    const makeUserCode = (length) => {
      let result = '';
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      const charsLength = chars.length;
      for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
      }
      return result;
    };
    // this takes first 3 letters of last name and 1 random character
    const userCode =
      lastName.substr(0, 3).toUpperCase() + makeUserCode(1).toUpperCase();
    // console.log('USERCODE', userCode);

    // }

    // checks to see if anyone has usercode
    User.findOne({ userCode }).exec((err, userCode) => {
      if (userCode) {
        const makeUserCode = (length) => {
          let result = '';
          const chars = 'abcdefghijklmnopqrstuvwxyz';
          const charsLength = chars.length;
          for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charsLength));
          }
          return result;
        };
        // this takes first 3 letters of last name and 1 random character
        userCode =
          lastName.substr(0, 3).toUpperCase() + makeUserCode(1).toUpperCase();
      }
    });

    // generate token with user name email and password
    const token = jwt.sign(
      { name, lastName, email, password, students, userCode },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '30m',
      }
    );

    // send email
    const params = registerEmailParams(email, token);

    const sendEmailOnRegister = ses.sendEmail(params).promise();

    sendEmailOnRegister
      .then((data) => {
        console.log('email submitted to SES', data);
        res.json({
          message: `Email has been sent to ${email}, follow the instructions to complete your registration.`,
        });
      })
      .catch((error) => {
        console.log('ses email on register', error);
        res.json({
          message: `Could not verify email. Please check your spelling and try again.`,
        });
      });
  });
};

exports.registerActivate = (req, res) => {
  const { token } = req.body;
  // console.log(token)
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    function (err, decoded) {
      if (err) {
        return res.status(403).json({
          error: 'Expired link. Try again.',
        });
      }

      const {
        name,
        lastName,
        email,
        password,
        categories,
        students,
        userCode,
      } = jwt.decode(token);
      const username = shortId.generate();

      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res.status(401).json({
            error: 'Email is taken',
          });
        }
        console.log(userCode);

        // register new user
        const newUser = new User({
          username,
          name,
          lastName,
          email,
          password,
          categories,
          students,
          userCode,
        });
        newUser.save((err, result) => {
          if (err) {
            console.log(err);
            return res.status(401).json({
              error: 'Error saving user in database. Try again later.',
            });
          }
          return res.json({
            message: 'Registration successful. Please login.',
          });
        });
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  // console.table({email,password})
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please register.',
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match',
      });
    }
    // generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

// exports.userLoginValidator = (req, res) => {
//   const {email, password} = req.body

// }

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['sha1', 'sha256', 'RS256', 'HS256'],
}); // req.user

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'user not found',
      });
    }

    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'user not found',
      });
    }
    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Admin access denied',
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  // if user exits with that email
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exit',
      });
    }
    // generate token and email to user
    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: '10m' }
    );
    // send email
    const params = forgotPasswordEmailParams(email, token);

    // populate the db > user > usertPasswordLink
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: 'Password reset failed. Try later.',
        });
      }
      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then((data) => {
          console.log('ses reset pw success', data);
          return res.json({
            message: `Email has been sent to ${email}. Click on link to reset your password.`,
          });
        })
        .catch((error) => {
          console.log('ses reset pw failed', data);
          return res.json({
            message: 'We could not verify your email. Please try again.',
          });
        });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    // check for expiry
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: 'Expired Link. Try again.',
          });
        }

        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: 'Invalid token. Try again.',
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: '',
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: 'Password rest failed. Try again',
              });
            }

            res.json({
              message: 'Great! Log in with your new password.',
            });
          });
        });
      }
    );
  }
};

exports.canUpdateDeleteLink = (req, res, next) => {
  const { id } = req.params;
  Link.findOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Count not find link',
      });
    }
    let authorizedUser =
      data.postedBy._id.toString() === req.user._id.toString(); // might be req._id.toString()
    if (!authorizedUser) {
      return res.status(400).json({
        error: 'You are not authorized',
      });
    }
    next();
  });
};
