const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { admins: Admin } = require('@models');

class JwtAdmin {
  constructor() {}

  verify(token, secret) {
    return jwt.verify(token, secret);
  }

  async createTokens(admin, secret, refreshSecret) {
    const createToken = jwt.sign(
      {
        admin: _.pick(admin, ['id', 'full_name', 'email', 'phone', 'role'])
      },
      secret,
      {
        expiresIn: 60 * 30
      }
    );

    const createRefreshToken = jwt.sign(
      {
        admin: _.pick(admin, ['id', 'full_name', 'email', 'phone', 'role'])
      },
      refreshSecret,
      {
        expiresIn: '3h'
      }
    );

    return [createToken, createRefreshToken];
  }

  async refreshTokens(refreshToken, SECRET, SECRET2) {
    let adminId = 0;
    try {
      const { admin } = jwt.decode(refreshToken);
      adminId = admin.id;
    } catch (err) {
      throw new Error(err);
    }

    if (!adminId) {
      throw new Error('Invalid refresh token');
    }

    const admin = await Admin.findOne({ where: { id: adminId }, raw: true });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const refreshSecret = admin.password + SECRET2;

    try {
      jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      if (err.message === 'jwt expired') {
        throw new Error('token expired please relogin');
      }
      throw new Error(err.message);
    }

    const [newToken, newRefreshToken] = await this.createTokens(admin, SECRET, refreshSecret);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      admin
    };
  }
}

module.exports = JwtAdmin;
