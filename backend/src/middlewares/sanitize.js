import xss from "xss";

const DEFAULT_SKIP_KEYS = new Set([
  "password",
  "confirmPassword",
  "passwordHash",
]);

const stripMongoOperators = (value) => {
  if (Array.isArray(value)) {
    return value.map(stripMongoOperators);
  }

  if (value && typeof value === "object") {
    const cleaned = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) {
        continue;
      }
      cleaned[key] = stripMongoOperators(val);
    }
    return cleaned;
  }

  return value;
};

const sanitizeStrings = (value, skipKeys) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeStrings(item, skipKeys));
  }

  if (value && typeof value === "object") {
    const cleaned = {};
    for (const [key, val] of Object.entries(value)) {
      if (skipKeys.has(key)) {
        cleaned[key] = val;
      } else {
        cleaned[key] = sanitizeStrings(val, skipKeys);
      }
    }
    return cleaned;
  }

  if (typeof value === "string") {
    return xss(value, { whiteList: {}, stripIgnoreTag: true });
  }

  return value;
};

export const sanitizeRequest = (options = {}) => {
  const skipKeys = options.skipKeys || DEFAULT_SKIP_KEYS;

  return (req, res, next) => {
    if (req.body) {
      const noSqlSafe = stripMongoOperators(req.body);
      req.body = sanitizeStrings(noSqlSafe, skipKeys);
    }

    if (req.params) {
      const noSqlSafe = stripMongoOperators(req.params);
      req.params = sanitizeStrings(noSqlSafe, skipKeys);
    }

    if (req.query) {
      const noSqlSafe = stripMongoOperators(req.query);
      req.sanitizedQuery = sanitizeStrings(noSqlSafe, skipKeys);
    }

    next();
  };
};
