import jwt, { Secret, SignOptions } from "jsonwebtoken";

const generateToken = (
  payload: string | object | Buffer,
  secret: Secret,
  expiresIn?: string | number | undefined
): string => {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: expiresIn as any,
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

const verifyToken = (token: string, secret: Secret): jwt.JwtPayload => {
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "string") {
    throw new Error("Invalid token");
  }
  return decoded as jwt.JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
