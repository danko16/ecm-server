require('module-alias/register');
const { response } = require('@utils');
const { adminService } = require('@services/v1');
const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/',
  [
    body('full_name', 'full name should be present')
      .matches(/^[A-Za-z\s]+$/i)
      .withMessage('full name can only contain char and space')
      .exists()
      .isLength({
        min: 4
      })
      .withMessage('full name must be at least 4 chars long'),
    body('email', 'email should be present')
      .exists()
      .isEmail()
      .withMessage('must be a valid email'),
    body('password', 'passwords must be at least 6 chars long')
      .exists()
      .isLength({
        min: 6
      }),
    body('phone')
      .exists()
      .isMobilePhone('id-ID')
      .withMessage('phone must be phone number format'),
    body('role')
      .exists()
      .withMessage('role must be exist'),
    body('client_id', 'Client id cannot be empty').exists(),
    body('provider', 'Provider cannot be empty').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    adminService.register(req, res);
  }
);

module.exports = router;
