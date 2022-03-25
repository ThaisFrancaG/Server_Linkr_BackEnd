import { connection } from "../db.js";
import findHashtags from "find-hashtags";

async function postPublication(req, res) {
  const { link, description, id } = req.body;

  if (!link) return res.sendStatus(400);
  try {
    const user = await connection.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);
    if (!user.rowCount) return res.sendStatus(404);

    await connection.query(
      `
			INSERT INTO posts (link, description, "userId")
			VALUES ($1,$2,$3)
		`,
      [link, description, id]
    );

    const { rows: listPosts } = await connection.query(`SELECT * FROM posts`);

    const hashtags = findHashtags(listPosts[listPosts.length - 1].description);

    hashtags.forEach(async (tag) => {
      await connection.query(
        `
				INSERT INTO hashtags (tag)
				VALUES ($1)`,
        [tag]
      );

      const { rows: tagId } = await connection.query(
        `SELECT id FROM hashtags WHERE tag=$1`,
        [tag]
      );

      await connection.query(
        `
			INSERT INTO "hashtagPosts" ("hashtagId", "postId")
			VALUES ($1, $2)`,
        [tagId[tagId.length - 1].id, listPosts[listPosts.length - 1].id]
      );
    });

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export { postPublication };
