import db from "../config/db.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

export async function getShortUrl(req, res) {
    const { url } = req.body;
    const token = req.headers.authorization;
    const secretKey = process.env.JWT_SECRET;
    const shortUrl = nanoid();

    if (!token) return res.status(401).send("Unauthorized");

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        const userId = decoded.userId;

        await db.query(`INSERT INTO url (url, "shortUrl", "userId") VALUES ($1, $2, $3)`, [url, shortUrl, userId]);
        return res.status(201).send({ shortUrl: shortUrl });

    } catch {
        return res.status(401).send("Unauthorized");
    }
}

export async function getShortUrlId(req, res) {
    const { id } = req.params;

    try {
        const url = await db.query(`SELECT url.id, url."shortUrl", url.url FROM url WHERE id = $1`, [id]);

        if (url.rows.length === 0) return res.status(404).send("Not found");

        return res.status(200).send(url.rows[0]);
    }
    catch {
        return res.status(500).send("Internal server error");
    }
}

export async function openShortUrl(req, res) {
    const { shortUrl } = req.params;

    try {
        const url = await db.query(`SELECT url.id, url."shortUrl", url.url FROM url WHERE "shortUrl" = $1`, [shortUrl]);
        if (url.rows.length === 0) return res.status(404).send("Not found");

        await db.query(`UPDATE url SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1`, [shortUrl]);

        return res.redirect(url.rows[0].url);
    }
    catch {
        return res.status(500).send("Internal server error");
    }
}

export async function deleteShortUrl(req, res) {
    const token = req.headers.authorization;
    const secretKey = process.env.JWT_SECRET;
    const shortUrlId = req.params.id;

    if (!token) return res.status(401).send("Unauthorized");

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        const userId = decoded.userId;

        const url = await db.query(`SELECT url."shortUrl", url."userId" FROM url WHERE id = $1`, [shortUrlId]);
        if (url.rows.length === 0) return res.status(404).send("Not found");
        if (url.rows[0].userId !== userId) return res.status(401).send("Unauthorized");

        await db.query(`DELETE FROM url WHERE id = $1`, [shortUrlId]);

        return res.status(204).send("Deleted");

    } catch {
        return res.status(500).send("Internal server error");
    }
}