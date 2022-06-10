import signUpSchema from "../schemas/signUpSchema.js";

export function validateSignUp(req, res, next) {
  const signUp = req.body;
  const validation = signUpSchema.validate(signUp);

  if (validation.error) {
    return res.sendStatus(400); // bad request
  }

  next();
}