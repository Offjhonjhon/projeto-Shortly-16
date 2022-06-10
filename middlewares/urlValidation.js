import urlSchema from "../schemas/urlSchema.js";

export function validateUrl(req, res, next) {
    const url = req.body;
    const { error } = urlSchema.validate(url);

    if (error) return res.status(422).send(error.details.map((d) => d.message));

    next();
}