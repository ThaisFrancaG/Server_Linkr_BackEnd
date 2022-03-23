import { connection } from "../db.js"

export default async function logOut(req,res) {
	const { token } = req.body;
	
	try {
		await connection.query(`
			DELETE FROM sessions
			WHERE token = $1
		`, [token]);

		res.sendStatus(202);
		return
	}catch(error) {
		console.log(error);
    	res.sendStatus(500);
		return
	}
}