const express = require('express');
const router = express.Router();

// import validators
const {
  teacherCreateValidator,
  teacherUpdateValidator,
} = require('../validators/teacher');
const { runValidation } = require('../validators');

// import from controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const {
  create,
  list,
  read,
  update,
  remove,
} = require('../controllers/teacher');

// routes categoryCreateValidator, runValidation,
router.post(
  '/teacher',
  teacherCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
router.get('/teachers', list);
router.post('/teacher/:slug', read);
router.put(
  '/teacher/:slug',
  teacherUpdateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  update
);
router.delete('/teacher/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;

