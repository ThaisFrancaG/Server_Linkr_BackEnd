import bcrypt from "bcrypt";
import { connection } from "../db";

export async function signUp(req, res) {
  const { email, password, username, pictureUrl } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const listUsers = await connection.query(
      `
    SELECT * FROM users
    WHERE email=$1`,
      [email]
    );
    if (listUsers.rowCount > 0) {
      return res.status(409).send("Email já cadastrado!");
    }

    await connection.query(
      `
    INSERT INTO
      users (email, password, username, "pictureUrl")
    VALUES ($1, $2, $3, $4)
    `,
      [email, passwordHash, username, pictureUrl]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
