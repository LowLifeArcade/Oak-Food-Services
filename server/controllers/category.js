const Category = require('../models/category');
const { linkPublishedParams } = require('../helpers/email');
const User = require('../models/user');
const Link = require('../models/link');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

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
  const { name, content, image, group, postedBy, menu, menu2, menu3, pickupWeek } = req.body;

  // taking req.body name and making a slug for image name url i think
  const slug = slugify(pickupWeek);
  let category = new Category({ name, content, slug, image, group, postedBy, menu, menu2, menu3, pickupWeek });

  if (image) {
    // image data
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
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
      category.image.url = data.Location;
      category.image.key = data.Key;

      // save to db
      category.save((err, data) => {
        console.log('error information', err);
        if (err) res.status(400).json({ error: 'Duplicate post' });
        res.json(data);
        
        // send email disabled for test 

        User.find({ special: { sendEmail: true } }).exec((err, users) => {
          if (err) {
            console.log('send email err', err);
            throw new Error(err);
          } else {
  
            for (let i = 0; i < users.length; i++) {
              const params = linkPublishedParams(users[i].email, data); // email mod
              const sendEmail = ses.sendEmail(params).promise();
  
              sendEmail
                .then((success) => {
                  console.log('email submitted to SES', success);
                  return;
                })
                .catch((failure) => {
                  console.log('error on email submitted to SES', failure);
                  return;
                });
            }
          }
        });



      });
    });
  } else {
    // save to db
    category.save((err, data) => {
      if (err) res.status(400).json({ error: 'Duplicate post' });
      console.log('MENU SAVE ERROR',err)
      res.json(data);

      User.find({ special: { sendEmail: true } }).exec((err, users) => {
        // console.log('emailable users', users);
        if (err) {
          console.log('send email err', err);
          throw new Error(err);
        } else {
          // data.categories = result;

          // disabled for testing
          // for (let i = 0; i < users.length; i++) {
          //   // console.log("user email stuff", users[i].email, data)
          //   const params = linkPublishedParams(users[i].email, data); // email mod
          //   const sendEmail = ses.sendEmail(params).promise();

          //   sendEmail
          //     .then((success) => {
          //       console.log('email submitted to SES', success);
          //       return;
          //     })
          //     .catch((failure) => {
          //       console.log('error on email submitted to SES', failure);
          //       return;
          //     });
          // }
        }
      });
    });
  }

  // $in is a mongoose thing letting you find one or many in something like categories which here comes from the newly posted link

  // if new blog post with a-group is posted this will email users in a group (i think)
  //  User.find({ categories: { $in: group } }).exec((err, users) => {
  //   if (err) {
  //     throw new Error(err);
  //   } else {
  //     data.categories = result;

  //     for (let i = 0; i < users.length; i++) {
  //       const params = linkPublishedParams(users[i].email, data); // email mod
  //       const sendEmail = ses.sendEmail(params).promise();

  //       sendEmail
  //         .then((success) => {
  //           console.log('email submitted to SES', success);
  //           return;
  //         })
  //         .catch((failure) => {
  //           console.log('error on email submitted to SES', failure);
  //           return;
  //         });
  //     }
  //   }
  // });
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
  const { name, image, content, group } = req.body;

  // image data
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );

  Category.findOneAndUpdate(
    { slug },
    { name, content, group },
    { new: true }
  ).exec((err, updated) => {
    if (err) {
      return res.status(400).json({
        error: 'Could find not category to update',
      });
    }
    // console.log('UPDATED', updated);

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
  });
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
