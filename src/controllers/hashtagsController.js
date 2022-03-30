import { connection } from "../db.js";

export default async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;

  try {
    const result = await connection.query(
      `
    SELECT * FROM posts
      JOIN "hashtagPosts" ON "hashtagPosts"."postId"=posts.id
      JOIN hashtags ON hashtags.id="hashtagPosts"."hashtagId"
    WHERE hashtags.tag=$1`,
      [hashtag]
    );
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

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
