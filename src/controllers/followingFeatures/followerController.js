import { connection } from "../../db.js";

async function toggleFollowing(req, res) {
  const authorization = req.headers.authorization;
  const followUser = req.body.userId;

  try {
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res.sendStatus(401);
    }

    const { rows: checkUserId } = await connection.query(
      `SELECT "userId" FROM sessions WHERE token=$1
      `,
      [token]
    );

    if (checkUserId.length === 0) {
      return res.sendStatus(404);
    }

    const { rows: checkFollowId } = await connection.query(
      `SELECT id FROM users WHERE id=$1`,
      [followUser]
    );
    if (checkFollowId.length === 0) {
      return res.sendStatus(404);
    }
    const userId = checkUserId[0].userId;

    const { rows: checkIfFollowing } = await connection.query(
      `SELECT * FROM followers WHERE "followerId"=$1 AND "followId" = $2`,
      [userId, followUser]
    );

    if (checkIfFollowing.length === 0) {
      await connection.query(
        `INSERT INTO followers ("followerId","followId") VALUES ($1,$2) `,
        [userId, followUser]
      );
    }

    if (checkIfFollowing.length > 0) {
      await connection.query(
        `DELETE FROM followers WHERE "followerId"=$1 AND "followId" = $2`,
        [userId, followUser]
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function getFollowing(req, res) {
  try {
  } catch (error) {}
}
export { toggleFollowing, getFollowing };
