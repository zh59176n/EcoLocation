import axios from "axios";

function stripHtmlTags(str) {
  return str.replace(/<[^>]*>/g, "");
}

export default async function handler(req, res) {
  try {
    const url = `https://content.guardianapis.com/search?section=environment&order-by=newest&page-size=50&show-fields=trailText,headline&api-key=${process.env.GUARDIAN_API_KEY}`;
    const { data } = await axios.get(url);

    const articles = data.response.results.map((it) => ({
      title: stripHtmlTags(it.fields.headline),
      description: stripHtmlTags(it.fields.trailText),
      url: it.webUrl,
    }));

    res.json({ articles });
  } catch (err) {
    console.error("Guardian fetch error:", err.message);
    res.status(502).json({ message: "Guardian API error" });
  }
}
