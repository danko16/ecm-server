require('module-alias/register');
const express = require('express');
const { response } = require('@utils');
const { categories: Category } = require('@models');
const multer = require('multer');
const config = require('config');
const { query, validationResult } = require('express-validator/check');

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

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(response(true, 'berhasil mendapatkan categories', categories));
  } catch (error) {
    return res.status(400).json(response(false, error));
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      return res.status(400).json(response(false, 'category not exist'));
    }
    await Category.destroy({ where: { id } });
    return res.status(200).json(response(true, 'berhasil menghapus kategori'));
  } catch (error) {
    return res.status(400).json(response(false, error));
  }
});

router.post(
  '/',
  [query('name', 'name should be present'), query('desc', 'description should be present')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    const { name, desc } = req.query;
    const category = await Category.findOne({ where: { name } });
    if (category) {
      return res.status(400).json(response(false, 'category already exist'));
    }
    upload(req, res, async function(error) {
      const { admin } = res.local;
      const { file } = req;

      const { filename } = file;
      const url = `${config.host}:${config.port}/uploads/${filename}`;

      if (error) {
        return res.status(422).json(response(false, error.message));
      }

      await Category.create({
        admin_id: admin.id,
        name,
        desc,
        image: url
      });

      return res.status(200).json(response(true, 'file uploaded'));
    });
  }
);

module.exports = router;
