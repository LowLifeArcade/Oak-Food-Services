const Group = require('../models/group');
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
  let group = new Group({ name, content, slug, postedBy });

  // save to db
  group.save((err, success) => {
    if (err) res.status(400).json({ error: 'Duplicate post' });
    // console.log(err)
    return res.json(success);
  });
};
// read

exports.list = (req, res) => {
  Group.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Groups could not load',
      });
    }
    res.json(data);
  });
};

// update

// delete
