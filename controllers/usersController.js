import db from "../config/db.js";
import jwt from "jsonwebtoken";

export async function getUsersId(req, res) {
    const token = req.headers.authorization;
    const secretKey = process.env.JWT_SECRET;
    const userId = Number(req.params.id);

    if (!token) return res.status(401).send("Unauthorized");

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        const tokenUserId = decoded.userId;

        const user = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);

        if (user.rows.length === 0) return res.status(404).send("Not found");
        if (tokenUserId !== userId) return res.status(401).send("Unauthorized");

        const shorts = await db.query(`
            SELECT users.id as "userId", users.name as "userName", url.id as "urlId", url."shortUrl", url.url, url."visitCount"
            FROM users 
            JOIN url ON users.id = url."userId"
            WHERE "userId" = $1`, [userId]);

        const visitCount = await db.query(`
            SELECT SUM("visitCount") 
            FROM url
            JOIN users ON users.id = url."userId" 
            WHERE "userId" = $1
            GROUP BY "userId"`, [userId]);

        res.send(shortUrltoObject(shorts.rows, visitCount.rows[0].sum));

    } catch {
        return res.status(500).send("Internal server error");
    }
}

function shortUrltoObject(shorts, visitCount) {
    const { userId, userName } = shorts[0];

    const shortenedUrls = shorts.map(row => {
        const { urlId, shortUrl, url, visitCount } = row;
        return {
            id: urlId,
            shortUrl,
            url,
            visitCount
        }
    })

    return {
        id: userId,
        name: userName,
        visitCount: visitCount,
        shortenedUrls
    }
}