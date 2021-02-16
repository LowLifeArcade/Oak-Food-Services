const Link = require('../models/link');
const User = require('../models/user');
const Category = require('../models/category');
const slugify = require('slugify');
const user = require('../models/user');
const AWS = require('aws-sdk');
const { linkPublishedParams } = require('../helpers/email');
const { exec } = require('child_process');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// create, list, read, update, remove

exports.create = (req, res) => {
  const { mealRequest, pickupOption, pickupTime } = req.body;
  // const { title, url, categories, type, medium } = req.body;
  // console.table({ title, url, categories, type, medium });
  // const slug = url;
  let link = new Link({ mealRequest, pickupOption, pickupTime });
  // posted by user. We save this for use in user dashboard etc
  link.postedBy = req.user._id;

  // categories (used this for postman as it came as string)
  // let arrayOfCategories = categories && categories.split(',');
  // link.categories = arrayOfCategories;

  // console.log(categories);

  // save link
  link.save((err, data) => {
    console.log(err);
    if (err) {
      return res.status(400).json({
        error: 'Link already exits',
      });
    }
    res.json(data);
    // find all users with categories in their profile. since we modified our user model each user will have array of categories

    // if new link posted has a category the user has in profile we send an email. Change to categories posted where categories will be weekly menu.

    // User.find({ categories: { $in: categories } }).exec((err, users) => {
    //   if (err) {
    //     throw new Error(err);
    //     console.log('Error in controllers/link');
    //   }
    //   Category.find({ _id: { $in: categories } }).exec((err, result) => {
    //     if (err) {
    //       throw new Error(err);
    //     } else {
    //       data.categories = result;

    //       for (let i = 0; i < users.length; i++) {
    //         const params = linkPublishedParams(users[i].email, data); // email mod
    //         const sendEmail = ses.sendEmail(params).promise();

    //         sendEmail
    //           .then((success) => {
    //             console.log('email submitted to SES', success);
    //             return;
    //           })
    //           .catch((failure) => {
    //             console.log('error on email submitted to SES', failure);
    //             return;
    //           });
    //       }
    //     }
    //   });
    // }); 
    
    // $in is a mongoose thing letting you find one or many in something like categories which here comes from the newly posted link
  });
};

exports.list = (req, res) => {
  // infinite scroll
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  // look for items and populate
  Link.find({})
    .populate('postedBy', 'name')
    .populate('categories', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Could not list links',
        });
      }
      res.json(data);
    });
};

exports.read = (req, res) => {
  const { id } = req.params;
  Link.findOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Error finding link',
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const updatedLink = ({ title, url, categories, type, medium } = req.body);
  // const updatedLink = {title, url, categories, type, medium}

  Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec(
    (err, updated) => {
      if (err) {
        return res.status(400).json({
          error: 'Error updating link',
        });
      }
      res.json(updated);
    }
  );
};

exports.remove = (req, res) => {
  const { id } = req.params;
  Link.findOneAndRemove({ _id: id }).exec((err, data) => {
    console.log(data);
    if (err) {
      return res.status(400).json({
        error: 'Error removing link',
      });
    }
    res.json({
      message: 'Link removed successfully',
    });
  });
};

exports.clickCount = (req, res) => {
  // link id // funky because of mongoose deprecassion
  const { linkId } = req.body;
  Link.findByIdAndUpdate(
    linkId,
    { $inc: { clicks: 1 } },
    { upsert: true, new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: 'Could not update view count',
      });
    }
    res.json(result);
  });
};

exports.popular = (req, res) => {
  Link.find()
    .populate('postedBy', 'name')
    .sort({ clicks: -1 })
    .limit(3)
    .exec((err, links) => {
      if (err) {
        return res.status(400).json({
          error: 'Links not found',
        });
      }
      res.json(links);
    });
};

exports.popularInCategory = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: 'Could not load categories',
      });
    }
    Link.find({ categories: category })
      .sort({ clicks: -1 })
      .limit(3)
      .exec((err, links) => {
        if (err) {
          return res.status(400).json({
            error: 'Links not found',
          });
        }
        res.json(links);
      });
  });
};
