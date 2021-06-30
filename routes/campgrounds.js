const express = require('express');
const router = express.Router();
const multer  = require('multer')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get( catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampgrounds))
   

router.get('/new', isLoggedIn,  catchAsync(campgrounds.renderNewForm))

router.route('/:id')
    .get( catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedIn,isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampgrounds))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampgrounds))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


module.exports = router;