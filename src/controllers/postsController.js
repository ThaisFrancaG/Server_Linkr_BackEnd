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
  try {
    let { rows: postList } = await connection.query(`
		SELECT p.id,p.link, p.description, p."userId",
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
      let link = postList[i].link;
      let info = await urlMetadata(link);
      detailedList.push({
        ...postList[i],
        linkName: info.title,
        linkBanner: info.image,
        linkDesc: info.description,
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
