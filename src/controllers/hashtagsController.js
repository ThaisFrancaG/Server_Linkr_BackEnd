import { connection } from "../db.js";
import findHashtags from "find-hashtags";

export default async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;

  try {
    const result = await connection.query(
      `
    SELECT * FROM posts
      JOIN hashtagPosts ON "hashtagPosts"."postId"=posts.id
      JOIN hashtags ON hashtags.id="hashtagPosts"."hashtagId"
    WHERE `,
      [hashtag]
    );

    return res.status(200).send(result.rows);
  } catch (error) {
    return res.status(500).send(error);
  }
}

// export default async function createHashtags(req, res) {

//   try {

//     return res.sendStatus(200);
//   } catch (error) {
//     return res.status(500).send(error)
//   }
// }