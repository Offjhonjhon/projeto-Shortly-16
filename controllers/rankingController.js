import db from "../config/db.js";

export async function getRanking(req, res) {
    try {
        const ranking = await db.query(`
            SELECT users.id , users.name, COUNT("shortUrl") as "linksCount", SUM("visitCount") as "visitCount"
            FROM users  
            JOIN url ON url."userId" = users.id
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10`)
        res.send(ranking.rows);
    }
    catch {
        return res.status(500).send("Internal server error");
    }
}