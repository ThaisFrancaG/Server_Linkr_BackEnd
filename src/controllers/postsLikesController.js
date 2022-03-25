import { connection } from "../db.js";

async function toggleLike(req, res) {
  const { token, postId, liked } = req.body;

  try {
    const { rows: checkSession } = await connection.query(
      `SELECT*FROM sessions WHERE token=$1
      `,
      [token]
    );
    if (checkSession.length === 0) {
      return res.sendStatus(401);
    }
    const userId = checkSession[0].userId;
    console.log(userId);

    if (liked === true) {
      await connection.query(
        `DELETE FROM likes WHERE "postId"=$1 AND "likedById"=$2`,
        [postId, userId]
      );
    }

    if (liked === false) {
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

async function getLikes(req, res) {
  console.log("fui chamado");
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer", "");
  if (!token) {
    return res.sendStatus(401);
  }

  const { rows: postLikes } = await connection.query(
    `SELECT COUNT("postId"),
     posts.id FROM likes 
     JOIN posts ON likes."postId"=posts.id 
     GROUP BY posts.id;`
  );

  console.log(postLikes);
  try {
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export { toggleLike, getLikes };
