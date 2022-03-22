import { connection } from "../db.js";
import { v4 as uuid } from "uuid";

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const { rows: users } = await connection.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );
    const user = users[0];
    if (users.length === 0 || user.password !== password) {
      return res.sendStatus(401);
    }
    const token = uuid();

    await connection.query(
      `
    INSERT INTO sessions (token,"userId") VALUES($1,$2)`,
      [token, user.id]
    );

    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
