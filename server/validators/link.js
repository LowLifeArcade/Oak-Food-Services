const { check } = require('express-validator');

exports.linkCreateValidator = [
  // check('title')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Title is required'),
  // check('url')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Url is required'),
  // check('categories')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Pick a category'),
  // check('type')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Pick a type free/paid'),
  // check('medium')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Picke a medium media or book'),
  check('pickupDate')
  .not()
  .isEmpty()
  .withMessage('Date is required!'),
  check('mealRequest')
  .not()
  .isEmpty()
  .withMessage('At least one meal required'),
  check('pickupOption')
  .not()
  .isEmpty()
  .withMessage('pick up option is required'),
  check('pickupTime')
  .not()
  .isEmpty()
  .withMessage('pick up time is required'),
  check('pickupCode')
  .not()
  .isEmpty()
  .withMessage('pick up code is required'),
  check('pickupCodeAdd')
  .not()
  .isEmpty()
  .withMessage('pick up code add is required'),
];

exports.linkUpdateValidator = [
  
  check('mealRequest')
  .not()
  .isEmpty()
  .withMessage('At least one meal required'),
  check('pickupOption')
  .not()
  .isEmpty()
  .withMessage('pick up option is required'),
  check('pickupTime')
  .not()
  .isEmpty()
  .withMessage('pick up time is required'),

  // check('title')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Title is required'),
  // check('url')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Url is required'),
  // check('categories')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Pick a category'),
  // check('type')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Pick a type free/paid'),
  // check('medium')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Pick a medium media or book'),
];

