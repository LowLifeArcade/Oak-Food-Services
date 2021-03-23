const { check } = require('express-validator');

exports.linkCreateValidator = [
  check('pickupDate')
  .not()
  .isEmpty()
  .withMessage('Date is required!'),
  check('orderStatus')
  .not()
  .isEmpty()
  .withMessage('Order Status'),
  check('mealRequest')
  .not()
  .isEmpty()
  .withMessage('At least one meal required'),
  check('pickupTime')
  .not()
  .isEmpty()
  .withMessage('pick up time is required'),
  check('pickupCode')
  .not()
  .isEmpty()
  .withMessage('pick up code is required'),
  check('pickupCodeAdd')
  .exists([{ checkFalsy: true }])
  .optional({ checkFalsy: true })
  .withMessage('pick up code add is required'),
];

exports.orderStatusValidator = [
  check('orderStatus')
  .not()
  .isEmpty()
  .withMessage('status required'),
];

exports.linkUpdateValidator = [
  check('pickupDate')
  .not()
  .isEmpty()
  .withMessage('Date is required!'),
  check('orderStatus')
  .not()
  .isEmpty()
  .withMessage('Order Status'),
  check('mealRequest')
  .not()
  .isEmpty()
  .withMessage('At least one meal required'),
  check('pickupTime')
  .not()
  .isEmpty()
  .withMessage('pick up time is required'),
  check('pickupCode')
  .not()
  .isEmpty()
  .withMessage('pick up code is required'),
  check('pickupCodeAdd')
  .exists([{ checkFalsy: true }])
  .optional({ checkFalsy: true })
  .withMessage('pick up code add is required'),
];

