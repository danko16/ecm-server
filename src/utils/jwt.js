const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { users: User } = require('@models');

class Jwt {
  constructor() {}

  async createTokens(user, secret, secret2) {
    const createToken = jwt.sign(
      {
        user: _.pick(user, ['id', 'full_name', 'email'])
      },
      secret,
      {
        expiresIn: '1h'
      }
    );

    const createRefreshToken = jwt.sign(
      {
        user: _.pick(user, 'id')
      },
      secret2,
      {
        expiresIn: '7d'
      }
    );

    return [createToken, createRefreshToken];
  }

  async refreshTokens(token, refreshToken, SECRET, SECRET2) {
    let userId = 0;
    try {
      const {
        user: { id }
      } = jwt.decode(refreshToken);
      userId = id;
    } catch (err) {
      return new Error(err);
    }

    if (!userId) {
      return new Error('Invalid refresh token');
    }

    const user = await User.findOne({ where: { id: userId }, raw: true });

    if (!user) {
      return new Error('User not found');
    }

    const refreshSecret = user.password + SECRET2;

    try {
      jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return new Error('Invalid refresh token');
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
