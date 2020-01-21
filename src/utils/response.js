const response = (status, msg, data, included) => ({
  status,
  message: msg,
  data,
  included
});

export default response;
