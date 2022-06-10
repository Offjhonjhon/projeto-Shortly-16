import db from "../config/db.js";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    const hash = await bcrypt.hash(password, 10);

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
            , [name, email, hash]);

        res.send(201);

    } catch (error) {
        res.sendStatus(500);
    }

}

export async function signIn() {

}