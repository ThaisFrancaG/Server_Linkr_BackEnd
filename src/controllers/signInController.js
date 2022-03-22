import { connection } from "../db.js";

export async function signIn(req, res) {
  const { email, password } = req.body;
  console.log(email);
  const checkEmail = false;
  try {
    if (!checkEmail) {
      return res.sendStatus(401);
    }
    const token = "Aquele token lá";
    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
