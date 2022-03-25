import { connection } from "../db.js";

async function toggleLike(req, res) {
  const { token, postId, liked } = req.body;
  console.log(liked);
  try {
    //ver se a sessão está valida, e já pegar o id do boy
    console.log(token);

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
      console.log("tem que descutir");

      await connection.query(
        `DELETE FROM likes WHERE "postId"=$1 AND "likedById"=$2`,
        [postId, userId]
      );
    }

    if (liked === false) {
      console.log("tem que curtir");
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

export { toggleLike };
