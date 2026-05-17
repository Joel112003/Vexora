import { apiResponse } from "../utilis/apiResponse.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));

    return res
      .status(400)
      .json(apiResponse(false, "Validation Failed", { errors }));
  }

  req.body = result.data;
  next();
};
