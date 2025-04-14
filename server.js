import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3001;

// Your Guardian API key
const GUARDIAN_API_KEY = "4f14c9e8-77a2-419a-8333-56e7c8ca2ba8";

function stripHtmlTags(str) {
  return str.replace(/<[^>]*>/g, "");
}

app.get("/eco-news", async (req, res) => {
  try {
    const url = `https://content.guardianapis.com/search?section=environment&order-by=newest&page-size=50&show-fields=trailText,headline&api-key=${GUARDIAN_API_KEY}`;
    const response = await axios.get(url);

    const articles = response.data.response.results.map((item) => ({
      title: stripHtmlTags(item.fields.headline),
      description: stripHtmlTags(item.fields.trailText),
      url: item.webUrl,
    }));

    res.json({ articles });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).send("Error fetching news");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
