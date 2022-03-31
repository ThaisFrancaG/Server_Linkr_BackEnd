import { connection } from "../db.js";

async function deletePost(req, res) {
  const postId = req.params.id;
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");

  if (!token) return res.sendStatus(400);

  try {
    await connection.query(
      `
    DELETE FROM posts WHERE posts.id=$1`,
      [postId]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { deletePost };
