const { check } = require('express-validator');

exports.groupCreateValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
  check('content')
    .isLength({ min: 5 })
    .withMessage('Content must be more than 5 characters')
];

exports.groupUpdateValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
  check('content')
    .isLength({ min: 5 })
    .withMessage('Content is required')
];

