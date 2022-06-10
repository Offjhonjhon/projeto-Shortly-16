import signInSchema from "../schemas/signInSchema.js";

export function validateSignIn(req, res, next) {
    const signIn = req.body;
    const { error } = signInSchema.validate(signIn);

    if (error) return res.status(422).send(error.details.map((d) => d.message));

    next();
}