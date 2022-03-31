import urlMetadata from "url-metadata";
import { connection } from "../db.js";
import findHashtags from "find-hashtags";

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

    const { rows: listPosts } = await connection.query(`SELECT * FROM posts`);

    const hashtags = findHashtags(listPosts[listPosts.length - 1].description);

    hashtags.forEach(async (tag) => {
      await connection.query(
        `
				INSERT INTO hashtags (tag)
				VALUES ($1)`,
        [tag]
      );

      const { rows: tagId } = await connection.query(
        `SELECT id FROM hashtags WHERE tag=$1`,
        [tag]
      );

      await connection.query(
        `
			INSERT INTO "hashtagPosts" ("hashtagId", "postId")
			VALUES ($1, $2)`,
        [tagId[tagId.length - 1].id, listPosts[listPosts.length - 1].id]
      );
    });

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function getPublications(req, res) {
  const authorization = req.headers.authorization;
  const { userId } = res.locals;

  try {
    let { rows: checkFollowing } = await connection.query(
      `
    SELECT * FROM followers WHERE "followerId"=$1
    `,
      [userId]
    );
    if (checkFollowing.length === 0) {
      return res
        .status(200)
        .send("You don't follow anyone yet. Search for new friends!");
    }

    let { rows: postList } = await connection.query(
      `
	SELECT
	  (SELECT COUNT("postId") FROM likes WHERE "postId"=p.id) as likes_count,
	  p.id,p.link, p.description, p."userId",
		up."pictureUrl" AS "userPic",
		un.username
		FROM posts p
		JOIN users up ON up.id=p."userId"
		JOIN users un ON un.id=p."userId"
		LEFT JOIN followers
		ON p."userId"=followers."followId" WHERE followers."followerId"=$1 OR followers."followId"=$1
		ORDER BY id DESC LIMIT 20
		`,
      [userId]
    );

    if (postList.length === 0) {
      return res.status(200).send("No posts found from your friends");
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
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  if (isNaN(Number(id))) return res.sendStatus(400);
  try {
    const session = await connection.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );
    if (!session.rowCount) return res.sendStatus(401);

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

    if (!detailedList.length) {
      detailedList.push({ username: userData.username });
    }

    return res.status(200).send(detailedList);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function updatePosts(req, res) {
  const { link, description, id } = req.body;
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");

  try {
    const session = await connection.query(
      `
      SELECT s.* 
      FROM sessions s 
      JOIN users u ON u.id = s."userId"
      WHERE s.token = $1`,
      [token]
    );
    if (!session.rowCount) return res.sendStatus(401);

    await connection.query(
      `
      UPDATE posts
      SET link = $1, description = $2
      WHERE id = $3
    `,
      [link, description, id]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export { postPublication, getPublications, getUserPosts, updatePosts };
