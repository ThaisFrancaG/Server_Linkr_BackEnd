import urlMetadata from "url-metadata";
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
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer", "");
  if (!token) {
    return res.sendStatus(401);
  }

  const { rows: checkSession } = await connection.query(
    `SELECT * FROM sessions WHERE token=$1
      `,
    [token.slice(1, token.length)]
  );

  const userId = checkSession[0].userId;

  try {
    let { rows: postList } = await connection.query(`
	  SELECT
	  (SELECT COUNT("postId") FROM likes WHERE "postId"=p.id) as likes_count,
	  p.id,p.link, p.description, p."userId",
		up."pictureUrl" AS "userPic",
		un.username
		FROM posts p
		JOIN users up ON up.id=p."userId"
		JOIN users un ON un.id=p."userId"
		ORDER BY id DESC LIMIT 20
		`);

    if (postList.length === 0) {
      return res.status(200).send("There are no posts yet");
    }

    let detailedList = [];

    for (let i = 0; i < postList.length; i++) {
      const { rows: checkLiked } = await connection.query(
        `SELECT*FROM likes WHERE "postId"=$1 AND "likedById"=$2`,
        [postList[i].id, userId]
      );

      let link = postList[i].link;
      let info = await urlMetadata(link);
      detailedList.push({
        ...postList[i],
        linkName: info.title,
        linkBanner: info.image,
        linkDesc: info.description,
        likedByUser: checkLiked.length > 0 ? true : false,
      });
    }
    res.status(200).send(detailedList);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function getUserPosts(req, res) {
  const { id } = req.params;
  if (isNaN(Number(id))) return res.sendStatus(400);
  try {
    const user = await connection.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);
    if (!user.rowCount) return res.sendStatus(404);
    const userData = user.rows[0];

    const { rows: posts } = await connection.query(
      `
			SELECT p.id,p.link, p.description, p."userId",
			up."pictureUrl" AS "userPic",
			un.username
			FROM posts p
			JOIN users up ON up.id=p."userId"
			JOIN users un ON un.id=p."userId"
			WHERE up.id = $1
		`,
      [userData.id]
    );

    let detailedList = [];

    for (let i = 0; i < posts.length; i++) {
      let link = posts[i].link;
      let info = await urlMetadata(link);
      detailedList.push({
        ...posts[i],
        linkName: info.title,
        linkBanner: info.image,
        linkDesc: info.description,
      });
    }

    return res.status(200).send(detailedList);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export { postPublication, getPublications, getUserPosts };
