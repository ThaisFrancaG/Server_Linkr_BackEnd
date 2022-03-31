import { connection } from "../db.js";

async function postComments(req, res) {
  const { postId } = req.params;
  const { userId, comment } = req.body;

  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");

  if (!token) return res.sendStatus(400);
  if (!comment) return res.sendStatus(400);
  try {
    const session = await connection.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );
    if (!session.rowCount) return res.sendStatus(401);

    const user = await connection.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);
    if (!user.rowCount) return res.sendStatus(404);

    await connection.query(
      `
			INSERT INTO comments (comment, "postId", "userId")
			VALUES ($1,$2,$3)
		`,
      [comment, postId, userId]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function getComments(req, res) {
  const { postId } = req.params;

  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  if (!token) return res.sendStatus(400);
  try {
    const session = await connection.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );
    if (!session.rowCount) return res.sendStatus(401);

    const user = await connection.query(`SELECT * FROM users WHERE id = $1`, [
      session.rows[0].userId,
    ]);
    if (!user.rowCount) return res.sendStatus(404);

    const comments = await connection.query(
      `
			SELECT u.username, u."pictureUrl", c.* , p."userId" AS "postOwnerId"
			FROM comments c
			JOIN users u ON u.id = c."userId"
			JOIN posts p ON p.id = c."postId"
			WHERE c."postId" = $1
			ORDER BY id DESC
		`,
      [postId]
    );

    return res.status(200).send(comments.rows);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export { postComments, getComments };
