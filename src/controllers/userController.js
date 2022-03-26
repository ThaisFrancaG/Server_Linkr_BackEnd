import { connection } from "../db.js";

async function getUserData(req, res) {
  const { token } = req.params;

  if (!token) return res.sendStatus(400);
  try {
    const session = await connection.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );
    if (!session.rowCount) return res.sendStatus(404);

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
  try {
    const { rows : users } = await connection.query(`
      SELECT id, username, "pictureUrl" 
      FROM users 
      WHERE username LIKE $1`, [`${name}%`]);

    return res.send(users)
  }catch(error) {
    return res.status(500).send(error);
  }
}

export { getUserData, getUsers };
