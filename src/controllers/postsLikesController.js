import { connection } from "../db.js";

async function toggleLike(req, res) {
  try {
    console.log("Chegou pra adicionar");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { toggleLike };
