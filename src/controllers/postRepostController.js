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

    await connection.query(
      `
			INSERT INTO posts (link, description, "userId", "isRepost","repostId")
			VALUES ($1,$2,$3,$4,$5)
		`,
      [postInfo.link, postInfo.description, postInfo.userId, true, userId]
    );
    await connection.query(
      `
			INSERT INTO reposts ("postId","originalPosterId","repostId")
			VALUES ($1,$2,$3)
		`,
      [postId, postInfo.userId, userId]
    );
    return res.sendStatus(201)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { addRepost };
