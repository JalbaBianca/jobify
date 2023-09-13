import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/CustomErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  console.log("auth middleware");
  console.log(req.cookies);
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("authentification invalid");

  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === "64f89639c635292c4a4d75de";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentification invalidd");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo user. Read Only");
  next();
};
