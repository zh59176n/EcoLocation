// server.js  (root of repo)
import "dotenv/config.js";          // ← add this line                             
import express from "express";
import axios from "axios";

const app  = express();
const PORT = process.env.PORT || 3001;

const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;

function stripHtmlTags(str) {
  return str.replace(/<[^>]*>/g, "");
}

app.get("/eco-news", async (_, res) => {
  try {
    const url = `https://content.guardianapis.com/search?section=environment&order-by=newest&page-size=50&show-fields=trailText,headline&api-key=${GUARDIAN_API_KEY}`;
    const { data } = await axios.get(url);

    const articles = data.response.results.map((it) => ({
      title: stripHtmlTags(it.fields.headline),
      description: stripHtmlTags(it.fields.trailText),
      url: it.webUrl,
    }));

    res.json({ articles });
  } catch (err) {
    console.error("Guardian fetch error →", err.message);
    res.status(502).json({ message: "Guardian API error" });
  }
});

app.listen(PORT, () =>
  console.log(`🌱  Eco API up → http://localhost:${PORT}/eco-news`)
);
