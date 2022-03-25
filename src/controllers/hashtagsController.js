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
