const express = require('express');
const router = express.Router();

// import validators
const {
  linkCreateValidator,
  linkUpdateValidator,
  orderStatusValidator
} = require('../validators/link');
const { runValidation } = require('../validators');

// import from controllers
const { requireSignin, authMiddleware, adminMiddleware, canUpdateDeleteLink } = require('../controllers/auth');
const {create, mockCreate, list, read, update, remove,all, clickCount, popular, popularInCategory, complete, listByDate} = require('../controllers/link')

// routes 
router.post('/link', linkCreateValidator, runValidation, requireSignin, authMiddleware, create);
router.post('/mock-link', linkCreateValidator, runValidation, requireSignin, authMiddleware, mockCreate);
router.post('/links', requireSignin, adminMiddleware, list);
router.post('/links-by-date', requireSignin, adminMiddleware, listByDate);
router.put('/click-count', clickCount)
router.get('/link/popular', popular)
router.get('/links/all', all)
router.get('/link/popular/:slug', popularInCategory)
router.get('/link/:id', read);
// user only delete
router.put('/link/:id', linkUpdateValidator, runValidation, requireSignin, authMiddleware, canUpdateDeleteLink, update);
router.delete('/link/:id', requireSignin, authMiddleware, canUpdateDeleteLink, remove);
// make admin only able to do something
router.put('/link/admin/:id', linkUpdateValidator, runValidation, requireSignin, adminMiddleware, update);
router.put('/link/admin/complete/:id', orderStatusValidator, runValidation, requireSignin, adminMiddleware, complete);
router.delete('/link/admin/:id', requireSignin, adminMiddleware, remove);


module.exports = router