require('module-alias/register');
const { adminService } = require('@services/v1');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  adminService.get(req, res);
});

module.exports = router;
