require('module-alias/register');
const { access_tokens: AccessToken } = require('@models');
const jwt = require('./jwt');
const response = require('./response');
const { secret1, secret2 } = require('config');

const auth = async (req, res, next) => {
  const Jwt = new jwt();
  const clientId = req.headers['x-client-id'];
  const provider = req.headers['x-provider'];
  let token = req.headers['x-token'];
  let refreshToken = req.headers['x-refresh-token'];

  if (!token && !refreshToken) {
    return res.status(403).json(response(false, 'token and refreshToken is not present'));
  } else if (!token) {
    return res.status(403).json(response(false, 'token is not present'));
  } else if (!refreshToken) {
    return res.status(403).json(response(false, 'refreshToken is not present'));
  }

  if (!clientId && !provider) {
    return res.status(403).json(response(false, 'ClientId and provider is not present'));
  } else if (!clientId) {
    return res.status(403).json(response(false, 'ClientId is not present'));
  } else if (!provider) {
    return res.status(403).json(response(false, 'Provider is not present'));
  }

  token = token.split(' ');
  refreshToken = refreshToken.split(' ');

  if (
    !token[1] ||
    !refreshToken[1] ||
    token[1] === 'null' ||
    refreshToken[1] === 'null' ||
    token[0] !== 'Bearer' ||
    refreshToken[0] !== 'Bearer'
  ) {
    return res.status(403).json(response(false, 'Invalid token or refreshToken'));
  }

  token = token[1];
  refreshToken = refreshToken[1];
  res.local = {};

  try {
    const parseToken = Jwt.verify(token, secret1);

    const { user } = parseToken;

    const accessToken = await AccessToken.findOne({
      where: {
        user_id: user.id,
        access_token: token,
        refresh_token: refreshToken,
        client_id: clientId,
        provider
      }
    });

    if (!accessToken) {
      return res.status(403).json(response(false, 'Please do login to get valid token'));
    }

    res.local.user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone
    };
  } catch (error) {
    try {
      const newTokens = await Jwt.refreshTokens(refreshToken, secret1, secret2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }

      const { user } = newTokens;

      const accessToken = await AccessToken.findOne({
        where: {
          user_id: user.id,
          access_token: token,
          refresh_token: refreshToken,
          client_id: clientId,
          provider
        }
      });

      if (!accessToken) {
        return res.status(403).json(response(false, 'Please do login to get valid token'));
      }

      await accessToken.update({
        access_token: newTokens.token,
        refresh_token: newTokens.refreshToken
      });

      res.local.user = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone
      };
    } catch (error) {
      return res.status(403).json(response(false, error.message));
    }
  }

  next();
};

module.exports = auth;
