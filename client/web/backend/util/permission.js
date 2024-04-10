import dotenv from "dotenv";
dotenv.config();

/*
const createJWT = ({ payload, options }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    ...defaultOptions,
    ...options,
  });
  return token;
};

export const sendResponseWithCookie = ({ res, statusCode, user, options }) => {
  const token = createJWT({ payload: { user }, options });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.JWT_LIFETIME * oneDay),
    signed: true,
    // secure flag later
  });
  res.status(statusCode).json({ user, token });
};
*/

export const sendResponseWithCookie = ({ res, statusCode, token }) => {
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.JWT_LIFETIME * oneDay),
    signed: true,
  });
  res.status(statusCode).json({ user, token });
};

export const checkPermissions = (user, item) => {
  if (user.role === "admin") return true;
  if (user.userId === item.user.toString()) return true;
  return false;
};
