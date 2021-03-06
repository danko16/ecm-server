const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { users: User } = require('@models');

class Jwt {
  constructor() {}

  verify(token, secret) {
    return jwt.verify(token, secret);
  }

  async createTokens(user, secret, refreshSecret) {
    const createToken = jwt.sign(
      {
        user: _.pick(user, ['id', 'full_name', 'email', 'phone'])
      },
      secret,
      {
        expiresIn: 60 * 30
      }
    );

    const createRefreshToken = jwt.sign(
      {
        user: _.pick(user, ['id', 'full_name', 'email', 'phone'])
      },
      refreshSecret,
      {
        expiresIn: '3h'
      }
    );

    return [createToken, createRefreshToken];
  }

  async refreshTokens(refreshToken, SECRET, SECRET2) {
    let userId = 0;
    try {
      const { user } = jwt.decode(refreshToken);
      userId = user.id;
    } catch (err) {
      throw new Error(err);
    }

    if (!userId) {
      throw new Error('Invalid refresh token');
    }

    const user = await User.findOne({ where: { id: userId }, raw: true });

    if (!user) {
      throw new Error('User not found');
    }

    const refreshSecret = user.password + SECRET2;

    try {
      jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      if (err.message === 'jwt expired') {
        throw new Error('token expired please relogin');
      }
      throw new Error(err.message);
    }

    const [newToken, newRefreshToken] = await this.createTokens(user, SECRET, refreshSecret);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      user
    };
  }
}

module.exports = Jwt;
