import { connection } from "../db.js";

async function validateUserToken(req, res, next) {
  const authorization = req.headers.authorization;
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

  const userId = checkUserId[0].userId;
  console.log(userId);
  res.locals.userId = userId;

  next();
}

export default validateUserToken;
