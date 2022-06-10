import signUpSchema from "../schemas/signUpSchema.js";

export function validateSignUp(req, res, next) {
  const signUp = req.body;
  const { error } = signUpSchema.validate(signUp);

  if (error) return res.status(422).send(error.details.map((d) => d.message));

  next();
}