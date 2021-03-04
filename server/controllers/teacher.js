const Teacher = require('../models/teacher');
const Link = require('../models/link');
const slugify = require('slugify');
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// create
exports.create = (req, res) => {
  // base64 taking off beginning of data
  const { name, content, postedBy } = req.body;

  // taking req.body name and making a slug for image name url i think
  const slug = slugify(name);
  let teacher = new Teacher({ name, content, slug, postedBy });
// console.log(teacher)
  // save to db
  teacher.save((err, success) => {
    if (err) res.status(400).json({ error: 'Duplicate post' });
    console.log(err)
    return res.json(success);
  });
};
// read

exports.read = (req, res) => {
  const { slug } = req.params;
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  Teacher.findOne({ slug })
    .populate('postedBy', '_id name username')
    .exec((err, category) => {
      if (err) {
        return res.status(400).json({
          error: 'Could not load category',
        });
      }
      // res.json(category)
      Link.find({ categories: category })
        .populate('postedBy', '_id name username')
        .populate('categories', 'name')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec((err, links) => {
          if (err) {
            return res.status(400).json({
              error: 'Could not load links of a category',
            });
          }
          res.json({ category, links });
        });
    });
};

exports.list = (req, res) => {
  Teacher.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Teachers could not load',
      });
    }
    res.json(data);
  });
};

// update
exports.update = (req, res) => {
  const { slug } = req.params;
  const { name, content } = req.body;

  Teacher.findOneAndUpdate({ slug }, { name, content }, { new: true }).exec(
    (err, updated) => {
      if (err) {
        return res.status(400).json({
          error: 'Could find not category to update',
        });
      }
      console.log('UPDATED', updated);

      
      updated.save((err, success) => {
        if (err) res.status(400).json({ error: 'Duplicate post' });
        // console.log(err)
        res.json(success);
      });
      // res.json(updated);
    }
  );
};

exports.remove = (req, res) => {
  const { slug } = req.params;
  Teacher.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Could not delete category',
      });
    }

    res.json({
      message: 'Teacher deleted successful',
    });
  });
};
// delete
