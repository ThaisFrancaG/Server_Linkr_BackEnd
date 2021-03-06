import { connection } from "../db.js";

async function addRepost(req, res) {
  const postId = req.body.postId;
  const { userId } = res.locals;

  try {
    const { rows: checkPost } = await connection.query(
      `SELECT * FROM posts WHERE id=$1`,
      [postId]
    );
    if (checkPost.length === 0) {
      return res.sendStatus(404);
    }
    const postInfo = checkPost[0];

    const { rows : user} = await connection.query(`SELECT * FROM users WHERE id = $1`, [userId])

    await connection.query(
      `
			INSERT INTO posts (link, description, "userId", "isRepost","repostId", "repostUsername")
			VALUES ($1,$2,$3,$4,$5,$6)
		`,
      [postInfo.link, postInfo.description, postInfo.userId, true, userId, user[0].username]
    );

    await connection.query(
      `
			INSERT INTO reposts ("postId","originalPosterId","repostId", "repostUsername")
			VALUES ($1,$2,$3, $4)
		`,
      [postId, postInfo.userId, userId, user[0].username]
    );
    return res.sendStatus(201)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { addRepost };
