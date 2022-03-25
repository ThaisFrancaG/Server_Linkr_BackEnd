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

    const { rows: listHashtags } = await connection.query(
      `SELECT description FROM posts`
    );

    const hashtags = findHashtags(listHashtags[0].description);

    hashtags.forEach((tag) => {
      connection.query(
        `
				INSERT INTO hashtags (tag)
				VALUES ($1)`,
        [tag]
      );
    });

    await connection.query(
      `
			INSERT INTO posts (link, description, "userId")
			VALUES ($1,$2,$3)
		`,
      [link, description, id]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export { postPublication };
