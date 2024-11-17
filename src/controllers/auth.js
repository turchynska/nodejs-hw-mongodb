import { registerUser, loginUser, refreshUserSession, logoutUser } from '../services/auth.js';
import { SEVEN_DAY } from '../constants/index.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const { accessToken, refreshToken, SEVEN_DAY, _id, refreshTokenValidUntil } =
    await loginUser(req.body);

 
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: SEVEN_DAY,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully login user',
    data: {
      accessToken,
    },
  });
};

export const refreshSessionControllers = async (req, res) => {

  const { accessToken, refreshToken, SEVEN_DAY, _id, refreshTokenValidUntil } =
    await refreshUserSession(req.cookies);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: SEVEN_DAY,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed session',
    data: {
      accessToken,
    },
  });
};

export const logoutControllers = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser();
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send()
}