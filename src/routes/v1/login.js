import 'module-alias/register';
import utils from '@utils';
import v1 from '@services/v1';
import express from 'express';
import { body, oneOf, validationResult } from 'express-validator';

const { meService } = v1;
const { response } = utils;
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
    body('*.provider', 'Provider cannot be empty').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }

    meService.login(req, res);
  }
);

export default router;
