const express = require('express');
const router = express.Router();

// import validators
const {
  groupCreateValidator,
  groupUpdateValidator,
} = require('../validators/group');
const { runValidation } = require('../validators');

// import from controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const {create, list, read, update, remove} = require('../controllers/group')

// routes categoryCreateValidator, runValidation,
router.post('/group', groupCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/groups', list);
// router.post('/group/:slug', read);
// router.put('/group/:slug', groupUpdateValidator, runValidation, requireSignin, adminMiddleware, update);
// router.delete('/group/:slug', requireSignin, adminMiddleware, remove);


module.exports = router

