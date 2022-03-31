import { connection } from "../db.js";

async function toggleLike(req, res) {
  const { postId } = req.body;
  const { userId } = res.locals;

  try {
    const { rows: liked } = await connection.query(
      `SELECT*FROM likes WHERE "postId"=$1 AND "likedById"=$2`,
      [postId, userId]
    );

    if (liked.length > 0) {
      await connection.query(
        `DELETE FROM likes WHERE "postId"=$1 AND "likedById"=$2`,
        [postId, userId]
      );
    }

    if (liked.length === 0) {
      await connection.query(
        `INSERT INTO likes ("postId","likedById") VALUES ($1,$2)`,
        [postId, userId]
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function getWhoLiked(req, res) {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    let { rows: likesList } = await connection.query(`
	  SELECT
    l."postId",
	  users.username, users.id
		FROM likes l
		JOIN users ON users.id=l."likedById"
		ORDER BY id DESC LIMIT 20
		`);
    res.status(200).send(likesList);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { toggleLike, getWhoLiked };
