require('module-alias/register');
const { response } = require('@utils');
const { productService } = require('@services/v1');
const express = require('express');
const { param, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', (req, res) => {
  productService.getAll(req, res);
});

router.get(
  '/:product_id',
  [param('product_id', 'Product id cannot be empty').exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }

    productService.get(req, res);
  }
);

module.exports = router;
