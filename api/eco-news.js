import axios from "axios";

function stripHtmlTags(str) {
  return str.replace(/<[^>]*>/g, "");
}

const TOPIC_MAP = {
  climate:  "section=environment&q=climate",
  energy:   "section=environment&q=energy",
  wildlife: "section=environment&q=wildlife",
  policy:   "section=politics&q=environment",
  science:  "section=science&q=environment",
};

export default async function handler(req, res) {
  const { topic = "all", q = "", page = "1" } = req.query;

  const topicParam = TOPIC_MAP[topic] ?? "section=environment";
  const searchParam = q ? `&q=${encodeURIComponent(q)}` : "";

  const url = [
    "https://content.guardianapis.com/search",
    `?${topicParam}${searchParam}`,
    "&order-by=newest",
    `&page=${page}`,
    "&page-size=12",
    "&show-fields=trailText,headline,thumbnail,byline,wordcount",
    `&api-key=${process.env.GUARDIAN_API_KEY}`,
  ].join("");

  try {
    const { data } = await axios.get(url);
    const articles = data.response.results.map((it) => ({
      title:       stripHtmlTags(it.fields.headline  ?? ""),
      description: stripHtmlTags(it.fields.trailText ?? ""),
      url:         it.webUrl,
      thumbnail:   it.fields.thumbnail ?? null,
      author:      it.fields.byline    ?? null,
      date:        it.webPublicationDate,
      wordCount:   parseInt(it.fields.wordcount) || 0,
      section:     it.sectionName,
    }));

    res.json({
      articles,
      totalPages:  data.response.pages,
      currentPage: data.response.currentPage,
    });
  } catch (err) {
    console.error("Guardian fetch error:", err.message);
    res.status(502).json({ message: "Guardian API error" });
  }
}
