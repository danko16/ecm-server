const { Op } = require('sequelize');
const { sequelize, users: User, access_tokens: AccessToken } = require('@models');
const { response, jwt } = require('@utils');
const { secret1, secret2 } = require('config');
const bcrypt = require('bcryptjs');

const meService = {
  register: async (req, res) => {
    const data = req.body;
    const expires = 365 * 24 * 60 * 60;
    const transaction = await sequelize.transaction();

    try {
      const isExist = await User.findOne({
        where: { [Op.or]: [{ email: data.email }, { phone: data.phone }] }
      });

      if (isExist) {
        if (isExist.email === data.email && isExist.phone === data.phone) {
          return res.status(400).json(response(false, 'Email and Phone already exist'));
        } else if (isExist.email === data.email) {
          return res.status(400).json(response(false, 'Email already exist'));
        } else if (isExist.phone === data.phone) {
          return res.status(400).json(response(false, 'Phone number already exist'));
        }
      }

      const salt = bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(data.password, salt);

      const user = await User.create(
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          password: hash
        },
        { transaction }
      );

      if (!user) {
        return res.status(400).json(response(false, 'Register failed'));
      }

      const refreshTokenSecret = user.password + secret2;

      const [token, refreshToken] = await jwt.createTokens(user, secret1, refreshTokenSecret);

      const accessTokenPayload = {
        access_token: token,
        refresh_token: refreshToken,
        provider: data.provider,
        user_id: user.id,
        expiry_in: expires,
        client_id: 'app'
      };

      const accessToken = await AccessToken.create(accessTokenPayload, { transaction });

      if (!accessToken) {
        await transaction.rollback();
        return res.status(400).json(response(false, 'Register failed'));
      }

      const payload = Object.assign({
        user_id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        access_token: accessToken.access_token,
        refresh_token: accessToken.refresh_token,
        client_id: 'app',
        client_secret: null,
        provider: 'local'
      });

      await transaction.commit();
      return res.status(200).json(response(true, 'Register success', payload));
    } catch (error) {
      await transaction.rollback();
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },
  login: async (req, res) => {
    const { data } = req.body;
    const expires = 365 * 24 * 60 * 60;

    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: data.email_phone }, { phone: data.email_phone }]
        }
      });

      if (!user) {
        return res.status(400).json(response(false, 'User not found!'));
      }

      if (bcrypt.compareSync(data.password, user.password)) {
        let accessToken = await AccessToken.findOne({
          where: {
            user_id: user.id,
            client_id: 'app'
          }
        });

        const refreshTokenSecret = user.password + secret2;

        const [token, refreshToken] = await jwt.createTokens(user, secret1, refreshTokenSecret);

        const accessTokenPayload = {
          access_token: token,
          refresh_token: refreshToken,
          provider: data.provider,
          user_id: user.id,
          expiry_in: expires,
          client_id: 'app'
        };

        if (!accessToken) {
          await AccessToken.create(accessTokenPayload);
        } else {
          await AccessToken.update(accessTokenPayload, {
            where: {
              user_id: user.id,
              client_id: 'app'
            }
          });
        }

        accessToken = await AccessToken.findOne({
          where: {
            user_id: user.id,
            client_id: 'app'
          },
          include: [{ model: User }]
        });

        const payload = Object.assign({
          user_id: accessToken.user.id,
          full_name: accessToken.user.full_name,
          email: accessToken.user.email,
          phone: accessToken.user.phone,
          access_token: accessToken.access_token,
          refresh_token: accessToken.refresh_token,
          client_id: 'app',
          client_secret: null,
          provider: 'local'
        });

        if (!payload) {
          return res.status(400).json(response(false, 'Login failed'));
        }

        return res.status(200).json(response(true, 'Login successfully', payload));
      }

      return res.status(422).json(response(false, 'Wrong password'));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = meService;
