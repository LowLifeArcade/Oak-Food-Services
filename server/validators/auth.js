const { check } = require('express-validator');

exports.userRegisterValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Must be valid email'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  check('categories')
    .not()
    .isEmpty()
    // .isLength({ min: 8 })
    .withMessage('Choose at least one school'),
];

exports.userLoginValidator = [
  check('email').isEmail().withMessage('Must be valid email'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

exports.forgotPasswordValidator = [
  check('email').isEmail().withMessage('Must be valid email'),
];

exports.resetPasswordValidator = [
  check('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  check('resetPasswordLink').not().isEmail().withMessage('Token is required'),
];

exports.userUpdateValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  // check('email').isEmail().withMessage('Must be valid email'),
];
