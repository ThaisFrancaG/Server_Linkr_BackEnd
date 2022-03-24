import { connection } from "../db.js";

async function postPublication (req,res) {
	const { link, description, id } = req.body;

	if (!link) return res.sendStatus(400)
	try {
		const user = await connection.query(`SELECT * FROM users WHERE id = $1`, [id]);
		if (!user.rowCount) return res.sendStatus(404)

		await connection.query(`
			INSERT INTO posts (link, description, "userId")
			VALUES ($1,$2,$3)
		`, [link, description, id])

		return res.sendStatus(201)
	}catch(error) {
		return res.status(500).send(error)
	}

}

export { postPublication };