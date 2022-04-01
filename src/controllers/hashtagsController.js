import { connection } from "../db.js";

export default async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;

  try {
    const result = await connection.query(
      `
      SELECT DISTINCT ON (p.id) p.id,
      (SELECT COUNT("postId") FROM likes WHERE "postId"=p.id) as likes_count,
      (SELECT COUNT("postId") FROM comments WHERE "postId"=p.id) as comment_count,
      (SELECT COUNT("postId") FROM reposts WHERE "postId"=p.id) as reposts_count,
      p.link, p.description, p."userId",p."isRepost",p."repostId", p."repostUsername",
      up."pictureUrl" AS "userPic",
      un.username
      FROM posts p
      JOIN users up ON up.id=p."userId"
      JOIN users un ON un.id=p."userId"
      JOIN "hashtagPosts" hp ON hp."postId"=p.id
      JOIN hashtags h ON h.id="hp."hashtagId"
      LEFT JOIN followers
      ON p."userId"=followers."followId" OR p."repostId"=followers."followId" 
      WHERE h.tag=$1
      ORDER BY p.id DESC LIMIT 20
      `,
      [hashtag]
    );
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }
    console.log(result.rows);

    res.status(200).send(result.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getHashtags(req, res) {
  try {
    const { rows: hashtag } = await connection.query(`
    SELECT 
      hashtags.*,
      "hashtagPosts"."hashtagId" AS "hashtagId",
    COUNT("hashtagPosts"."hashtagId") AS "hashtagCount"
    FROM hashtags
      JOIN "hashtagPosts" ON "hashtagPosts"."hashtagId"=hashtags.id
    GROUP BY "hashtagPosts"."hashtagId", hashtags.id
    ORDER BY "hashtagCount" DESC
      LIMIT 10
`);
    res.status(200).send(hashtag);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
