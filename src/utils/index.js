import response from './response';
import Jwt from './jwt';
import auth from './auth';

export default {
  auth,
  jwt: new Jwt(),
  response
};
