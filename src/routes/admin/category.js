require('module-alias/register');
const express = require('express');
const { response } = require('@utils');
const multer = require('multer');
const config = require('config');
const { body, validationResult } = require('express-validator/check');

const router = express.Router();

const storage = multer.diskStorage({
  destination: config.uploads,
  filename: function(req, file, cb) {
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 8000000, files: 3 },
  fileFilter: async function(req, file, cb) {
    // if (!req.body.type) {
    //   cb(new Error('Type need to be specified'));
    // }
    cb(null, true);
  }
}).single('file');

router.post('/', [body('name', 'name should be present')], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  upload(req, res, function(error) {
    if (error) {
      return res.status(422).json(response(false, error.message));
    }
    res.status(200).json(response(true, 'file uploaded'));
  });
});

module.exports = router;
