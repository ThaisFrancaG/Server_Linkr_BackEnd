import { connection } from "../db.js";

async function deletePost(req, res) {
  const postId = req.params.id;

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
