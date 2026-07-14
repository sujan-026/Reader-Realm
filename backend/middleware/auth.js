import jwt from "jsonwebtoken";

export const signToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role || "user",
    name: user.name,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return {
    ...obj,
    id: obj._id?.toString?.() || obj.id,
  };
};

export const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

/** Attach user if a valid token is present; otherwise continue anonymously. */
export const optionalProtect = (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
      const token = header.split(" ")[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    }
  } catch {
    // ignore invalid token for optional auth
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  next();
};

export const adminOrSelf = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  const isAdmin = req.user.role === "admin";
  const isSelf = req.user.id === req.params.id;

  if (!isAdmin && !isSelf) {
    return res
      .status(403)
      .json({ success: false, message: "Not authorized" });
  }

  next();
};
