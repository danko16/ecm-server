require('module-alias/register');
const { response } = require('@utils');
const { categoryService } = require('@services/v1');
const express = require('express');
const { param, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', (req, res) => {
  categoryService.getAll(req, res);
});

router.get(
  '/:category_id',
  [param('category_id', 'Category id cannot be empty').exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }

    categoryService.get(req, res);
  }
);

router.get(
  '/:category_id/product',
  [param('category_id', 'Category id cannot be empty').exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }

    categoryService.getProduct(req, res);
  }
);

module.exports = router;
