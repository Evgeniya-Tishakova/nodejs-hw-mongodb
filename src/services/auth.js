import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { User } from "../db/models/user.js";
import createHttpError from "http-errors";
import { Session } from "../db/models/session.js";

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user) throw createHttpError(409, "Email in use");

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, "User not found");
  }
  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw createHttpError(401, "Unauthorized");
  }

  await Session.deleteOne({ userId: user._id.toString() });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return await Session.create({
    userId: user._id.toString(),
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async (sessionId, refreshToken) => {
  const session = await Session.findOne({ _id: sessionId });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized("Refresh token is invalid");
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  await Session.deleteOne({ _id: session._id });

  const newAccessToken = randomBytes(30).toString("base64");
  const newRefreshToken = randomBytes(30).toString("base64");

  return Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};
