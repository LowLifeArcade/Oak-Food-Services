const { Route53Resolver } = require('aws-sdk');
const express = require('express');

const router = express.Router();

// import middlewares
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require('../controllers/auth');

// import validator
const {userUpdateValidator} = require('../validators/auth')
const {runValidation} = require('../validators')

// import controllers
const { read, update, addStudents, list } = require('../controllers/user');

// routes
router.get('/user', requireSignin, authMiddleware, read);
router.get('/admin', requireSignin, adminMiddleware, read);
router.get('/user-list', requireSignin, adminMiddleware, list);
router.put('/user', requireSignin, runValidation, requireSignin, authMiddleware, update);
router.put('/user/add', requireSignin, runValidation, requireSignin, authMiddleware, addStudents);

module.exports = router;
