const { check } = require('express-validator');

exports.categoryCreateValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  // check('group').not().isEmpty().withMessage('Group is required'),
  // check('content')
  //   .isLength({ min: 20 })
  //   .withMessage('Content must be more than 20 characters'),
];

exports.categoryUpdateValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  // check('group').not().isEmpty().withMessage('Group is required'),
  // check('content').isLength({ min: 20 }).withMessage('Content is required'),
];
