const Category = require('../models/category');
const Link = require('../models/link');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// s3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

// exports.create = (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({
//         error: 'Image could not upload',
//       });
//     }
//     // console.table({err, fields, files})
//     const { name, content } = fields;
//     const { image } = files;

//     const slug = slugify(name);
//     let category = new Category({ name, content, slug });

//     if (image.size > 2000000) {
//       return res.status(400).json({
//         error: 'Image must be less that 2mb',
//       });
//     }
//     // upload image to s3
//     const params = {
//       Bucket: 'oakfoods',
//       Key: `category/${uuidv4()}`,
//       Body: fs.readFileSync(image.path), // reads whole image before uploading !important
//       ACL: 'public-read',
//       ContentType: `image/jpg`,
//     };

//     s3.upload(params, (err, data) => {
//       if (err) res.status(400).json({ error: 'Upload to s3 failed' });
//       console.log('AWS UPLOAD RES DATA', data);
//       category.image.url = data.Location;
//       category.image.key = data.Key;
//       console.log(category);

//       // save to db
//       category.save((err, success) => {
//         if (err) res.status(400).json({ error: 'Duplicate post' });
//         // console.log(err)
//         return res.json(success);
//       });
//     });
//   });
// };

exports.create = (req, res) => {
  // base64 taking off beginning of data
  const { name, image, content } = req.body;
  // image data
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );
  const type = image.split(';')[0].split('/')[1];

  // taking req.body name and making a slug for image name url i think
  const slug = slugify(name);
  let category = new Category({ name, content, slug });

  // params for image data
  const params = {
    Bucket: 'oakfoods',
    Key: `category/${uuidv4()}.${type}`,
    Body: base64Data, // reads whole image before uploading !important
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,
  };

  // upload to s3
  s3.upload(params, (err, data) => {
    if (err) res.status(400).json({ error: 'Upload to s3 failed' });
    console.log('AWS UPLOAD RES DATA', data);
    category.image.url = data.Location;
    category.image.key = data.Key;
    // posted by
    // category.postedBy = data.user._id;

    console.log(category);

    // save to db
    category.save((err, success) => {
      if (err) res.status(400).json({ error: 'Duplicate post' });
      // console.log(err)
      return res.json(success);
    });
  });
};

// exports.create = (req, res) => {
//   const { name, content } = req.body;
//   const slug = slugify(name);
//   const image = {
//     url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
//     key: '123',
//   };

//   const category = new Category({ name, slug, image });
//   category.postedBy = req.user._id;

//   category.save((err, data) => {
//     if (err) {
//       console.log('CATEGORY CREATE ERR', err);
//       return res.status(400).json({
//         error: 'Category cteate failed',
//       });
//     }
//     res.json(data);
//   });
// };

exports.list = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Categories could not load',
      });
    }
    res.json(data);
  });
};

// gives us the single category and associated links
exports.read = (req, res) => {
  const { slug } = req.params;
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  Category.findOne({ slug })
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

exports.update = (req, res) => {
  const { slug } = req.params;
  const { name, image, content } = req.body;

  // image data
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );

  Category.findOneAndUpdate({ slug }, { name, content }, { new: true }).exec(
    (err, updated) => {
      if (err) {
        return res.status(400).json({
          error: 'Could find not category to update',
        });
      }
      console.log('UPDATED', updated);

      // incase of image
      if (image) {
        // find image in aws and remove from s3 before updating
        const deleteParams = {
          Bucket: 'oakfoods',
          Key: `${updated.image.key}`,
        };

        s3.deleteObject(deleteParams, function (err, data) {
          if (err) console.log('S3 DELETE ERROR DURING UPDATE', err);
          else console.log('S3 DELETED DURING UPDATE', data); //deleted
        });

        const type = image.split(';')[0].split('/')[1];


        // params for image data
        const params = {
          Bucket: 'oakfoods',
          Key: `category/${uuidv4()}.${type}`,
          Body: base64Data, // reads whole image before uploading !important
          ACL: 'public-read',
          ContentEncoding: 'base64',
          ContentType: `image/${type}`,
        };

        // upload to s3
        s3.upload(params, (err, data) => {
          if (err) res.status(400).json({ error: 'Upload to s3 failed' });
          console.log('AWS UPLOAD RES DATA', data);
          updated.image.url = data.Location;
          updated.image.key = data.Key;

          // save to db
          updated.save((err, success) => {
            if (err) res.status(400).json({ error: 'Duplicate post' });
            // console.log(err)
            res.json(success);
          });
        });
      } else {
        // if no image it just does this anyway
        res.json(updated);
      }
    }
  );
};

exports.remove = (req, res) => {
  const { slug } = req.params;
  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Could not delete category',
      });
    }
    // find image in aws and remove from s3 before updating
    const deleteParams = {
      Bucket: 'oakfoods',
      Key: `${data.image.key}`,
    };

    s3.deleteObject(deleteParams, function (err, data) {
      if (err) console.log('S3 DELETE ERROR DURING ', err);
      else console.log('S3 DELETED DURING ', data); //deleted
    });
    res.json({
      message: 'Category delete successful',
    });
  });
};
