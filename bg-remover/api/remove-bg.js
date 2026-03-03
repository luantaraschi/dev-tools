import fetch from "node-fetch";
import FormData from "form-data";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Form parse error" });
    }

    try {
      const file = files.image_file[0];
      const buffer = fs.readFileSync(file.filepath);

      const formData = new FormData();
      formData.append("image_file", buffer, "image.png");
      formData.append("size", "auto");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.REMOVE_BG_API_KEY,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(500).send(text);
      }

      const arrayBuffer = await response.arrayBuffer();

      res.setHeader("Content-Type", "image/png");
      res.status(200).send(Buffer.from(arrayBuffer));
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Remove failed" });
    }
  });
}