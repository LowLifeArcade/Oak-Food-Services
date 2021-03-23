const { check } = require('express-validator');

exports.teacherCreateValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
  check('content')
    .isLength({ min: 5 })
    .withMessage('Content must be more than 5 characters')
];

exports.teacherUpdateValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
  check('content')
    .isLength({ min: 5 })
    .withMessage('Content is required')
];

