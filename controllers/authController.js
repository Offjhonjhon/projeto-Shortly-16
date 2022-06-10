import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { stripHtml } from "string-strip-html";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const sanitizedName = stripHtml(name).result.trim();

    if (password !== confirmPassword) {
        return res.status(400).send("As senhas não conferem");
    }

    try {
        const result = await db.query("SELECT id FROM users WHERE email = $1", [email]);
        if (result.rowCount > 0) {
            return res.status(409).send({ error: "Email já cadastrado" });
        }

        await db.query(`
            INSERT INTO users(name, email, password) 
            VALUES ($1, $2, $3)`
            , [sanitizedName, email, hash]);

        res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500);
    }

}

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rowCount === 0) {
            return res.status(401).send({ error: "Usuário não encontrado" });
        }

        const isValid = await bcrypt.compare(password, user.rows[0].password);

        if (user.rows[0] && isValid) {
            const data = { userId: user.rows[0].id, name: user.rows[0].name };
            const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });

            await db.query(`INSERT INTO sections (token, "userId") VALUES ($1, $2)`, [token, user.rows[0].id]);

            return res.status(200).send({ token });
        }
        else {
            return res.status(401).send({ error: "Email ou senha incorretos" });
        }

    } catch {
        res.sendStatus(500);
    }
}