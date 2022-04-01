import { connection } from "../db.js";

async function getUserData(req, res) {
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");

  if (!token) return res.sendStatus(400)
  try {
    const session = await connection.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );
    if (!session.rowCount) return res.sendStatus(401);

    const user = await connection.query(
      `
			SELECT id, username, "pictureUrl"
			FROM users 
			WHERE id = $1
		`,
      [session.rows[0].userId]
    );
    if (!user.rowCount) return res.sendStatus(404);

    return res.send(user.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

async function getUsers(req,res) {
  const { name } = req.query;
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");

  if (!token) return res.sendStatus(400)

  try {
    const session = await connection.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );
    if (!session.rowCount) return res.sendStatus(401);

    const user = session.rows[0];

    const { rows : userFollows } = await connection.query(`
      SELECT * FROM followers 
      WHERE "followerId" = $1 AND "followerId" != "followId"`, [user.userId])

    const { rows : users } = await connection.query(`
      SELECT id, username, "pictureUrl" 
      FROM users 
      WHERE username LIKE $1
      `, [`${name}%`]);

    const searchList = users.map(prof => ({
      id: prof.id,
      username: prof.username,
      pictureUrl: prof.pictureUrl,
      userFollows: userFollows.filter(fol => fol.followId === prof.id).length ? true : false
    }))
    searchList.sort((x ,y) => x.userFollows === y.userFollows ? 0 : x.userFollows ? -1 : 1);
    
    return res.send(searchList.slice(0,3))
  }catch(error) {
    return res.status(500).send(error);
  }
}

export { getUserData, getUsers };
