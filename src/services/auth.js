import * as fs from "node:fs";
import path from "node:path";

import bcrypt from "bcrypt";
import Handlebars from "handlebars";
import jwt from "jsonwebtoken";

import { randomBytes } from "crypto";
import { User } from "../db/models/user.js";
import createHttpError from "http-errors";
import { Session } from "../db/models/session.js";

import { sendMail } from "../utils/sendMail.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve("src", "templates", "reset-password.hbs"),
  "UTF-8"
);

console.log(RESET_PASSWORD_TEMPLATE);

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

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar("JWT_SECRET"),
    {
      expiresIn: "5m",
    }
  );

  const html = Handlebars.compile(RESET_PASSWORD_TEMPLATE);

  await sendMail(
    user.email,
    "Reset your password",
    html({ link: `http://localhost:3000/reset-password/?token=${token}` })
  );
};

export const resetPassword = async (password, token) => {
  let entries;

  try {
    entries = jwt.verify(token, getEnvVar("JWT_SECRET"));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, "Token is expired or invalid.");
    throw err;
  }

  const user = await User.findById({
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(
    { _id: user._id },
    { password: encryptedPassword }
  );
};
