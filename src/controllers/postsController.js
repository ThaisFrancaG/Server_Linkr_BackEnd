import { query } from "express";
import { connection } from "../db.js";

async function postPublication(req, res) {
  const { link, description, id } = req.body;

  if (!link) return res.sendStatus(400);
  try {
    const user = await connection.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);
    if (!user.rowCount) return res.sendStatus(404);

    await connection.query(
      `
			INSERT INTO posts (link, description, "userId")
			VALUES ($1,$2,$3)
		`,
      [link, description, id]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function getPublications(req, res) {
  //é pra pegar todos os posts sem distinção
  console.log("chegou aqui");
  try {
    let { rows: postList } = await connection.query(`
		SELECT * FROM posts ORDER BY id DESC LIMIT 20
		`);

    res.status(200).send(postList);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export { postPublication, getPublications };
