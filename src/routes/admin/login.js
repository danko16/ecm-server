require('module-alias/register');
const { response } = require('@utils');
const { adminService } = require('@services/v1');
const express = require('express');
const { body, oneOf, validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/',
  [
    body('*.email_phone')
      .exists()
      .withMessage('Email or Phone cannot be empty'),
    oneOf([
      body('*.email_phone')
        .isMobilePhone('id-ID')
        .withMessage('Must be phone number format'),
      body('*.email_phone')
        .isEmail()
        .withMessage('Must be valid email')
    ]),
    body('*.password', 'passwords must be at least 5 chars long')
      .exists()
      .isLength({
        min: 5
      }),

    body('*.client_id', 'Client id cannot be empty').exists(),
    body('*.provider', 'Provider cannot be empty').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }

    adminService.login(req, res);
  }
);

module.exports = router;
