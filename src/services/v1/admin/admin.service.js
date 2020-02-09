const { Op } = require('sequelize');
const _ = require('lodash');
const { sequelize, admins: Admin, admin_tokens: AdminToken } = require('@models');
const { response, jwtAdmin } = require('@utils');
const { secret1, secret2 } = require('config');
const bcrypt = require('bcryptjs');

const adminService = {
  get: async (req, res) => {
    const { admin } = res.local;
    try {
      const me = await Admin.findOne({ where: { id: admin.id } });
      if (!me) {
        return res.status(400).json(response(false, 'Admin not found'));
      }
      const payload = _.pick(me, ['id', 'full_name', 'email', 'phone', 'role', 'image']);
      return res.status(200).json(response(true, 'Success get admin info', payload));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },
  register: async (req, res) => {
    const data = req.body;
    const transaction = await sequelize.transaction();

    try {
      const isExist = await Admin.findOne({
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

      const admin = await Admin.create(
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          password: hash
        },
        { transaction }
      );

      if (!admin) {
        return res.status(400).json(response(false, 'Register failed'));
      }

      const refreshTokenSecret = admin.password + secret2;

      const [token, refreshToken] = await jwtAdmin.createTokens(admin, secret1, refreshTokenSecret);

      const accessTokenPayload = {
        access_token: token,
        refresh_token: refreshToken,
        provider: data.provider,
        admin_id: admin.id,
        client_id: data.client_id
      };

      const accessToken = await AdminToken.create(accessTokenPayload, { transaction });

      if (!accessToken) {
        await transaction.rollback();
        return res.status(400).json(response(false, 'Register failed'));
      }

      const payload = Object.assign({
        admin_id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        image: admin.image,
        access_token: accessToken.access_token,
        refresh_token: accessToken.refresh_token,
        client_id: accessToken.client_id,
        client_secret: null,
        provider: accessToken.provider
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

    try {
      const admin = await Admin.findOne({
        where: {
          [Op.or]: [{ email: data.email_phone }, { phone: data.email_phone }]
        }
      });

      if (!admin) {
        return res.status(400).json(response(false, 'User not found!'));
      }

      if (bcrypt.compareSync(data.password, admin.password)) {
        let accessToken = await AdminToken.findOne({
          where: {
            admin_id: admin.id,
            client_id: data.client_id
          }
        });

        const refreshTokenSecret = admin.password + secret2;

        const [token, refreshToken] = await jwtAdmin.createTokens(
          admin,
          secret1,
          refreshTokenSecret
        );

        const accessTokenPayload = {
          access_token: token,
          refresh_token: refreshToken,
          provider: data.provider,
          admin_id: admin.id,
          client_id: data.client_id
        };

        if (!accessToken) {
          await AdminToken.create(accessTokenPayload);
        } else {
          await AdminToken.update(accessTokenPayload, {
            where: {
              admin_id: admin.id,
              client_id: data.client_id
            }
          });
        }

        accessToken = await AdminToken.findOne({
          where: {
            admin_id: admin.id,
            client_id: data.client_id
          },
          include: [{ model: Admin }]
        });

        const payload = Object.assign({
          admin_id: accessToken.admin.id,
          full_name: accessToken.admin.full_name,
          email: accessToken.admin.email,
          phone: accessToken.admin.phone,
          role: accessToken.admin.role,
          image: accessToken.admin.image,
          access_token: accessToken.access_token,
          refresh_token: accessToken.refresh_token,
          client_id: accessToken.client_id,
          client_secret: null,
          provider: accessToken.provider
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

module.exports = adminService;
