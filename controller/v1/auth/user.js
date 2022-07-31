const { userService } = require('../../../service/service');

const { response } = require('../../../error/response');

const register = async (req, res) => {
  try {
    const response = await userService.register(req.body);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const verify = async (req, res) => {
  try {
    const response = await userService.verify(req.params.userId, req.params.token);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const resendVerification = async (req, res) => {
  try {
    const response = await userService.resendVerification(req.params.userId);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const login = async (req, res) => {
  try {
    const response = await userService.login(req.body);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const logout = async (req, res) => {
  try {
    req.headers.authorization = '';

    res.status(201).json({ status: true, message: 'Logged out' });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

module.exports = { register, verify, resendVerification, login, logout };
