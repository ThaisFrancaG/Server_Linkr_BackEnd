import { query } from "express";
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
  try {
    let { rows: postList } = await connection.query(`
		SELECT p.id,p.link, p.description,
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

    //talvez adicionar um mappin pra mudar o valor de link
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
export { postPublication, getPublications };
