import { connection } from "../../db.js";

async function toggleFollowing(req, res) {
  const followUser = req.body.userId;
  const { userId } = res.locals;
  console.log(userId);
  console.log(followUser);

  try {
    const { rows: checkFollowId } = await connection.query(
      `SELECT id FROM users WHERE id=$1`,
      [followUser]
    );
    if (checkFollowId.length === 0) {
      return res.sendStatus(404);
    }

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
  const { userId } = res.locals;
  try {
    const { rows: userFollows } = await connection.query(
      `
    SELECT followers."followId" AS "FollowingId",
    users.username
    FROM followers 
    JOIN users ON users.id=followers."followId"
    WHERE "followerId"=$1
    `,
      [userId]
    );

    console.log(userFollows);

    res.status(200).send(userFollows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export { toggleFollowing, getFollowing };
