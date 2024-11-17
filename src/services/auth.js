import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { UsersCollection } from "../db/models/user.js";
import { FIFTEEN_MINUTES, SEVEN_DAY } from '../constants/index.js';
import {SessionsCollection} from '../db/models/session.js'

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAY),
    };
}


export const registerUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};


export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUserSession = async ({sessionId, refreshToken}) => {
  const session = await SessionsCollection.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found')
  }
  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token expired');
  }
   await SessionsCollection.deleteOne({ userId: sessionId._id });

   const newSession = createSession();

   return await SessionsCollection.create({
     userId: session.userId,
     ...newSession,
   });
}

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({_id: sessionId})
}


export const findSession = filter => SessionsCollection.findOne(filter);

export const findUser = filter => UsersCollection.findOne(filter);