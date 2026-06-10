import "dotenv/config.js";
import express from "express";
import axios from "axios";
import Anthropic from "@anthropic-ai/sdk";

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

app.get("/eco-news", async (req, res) => {
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
    console.error("Guardian fetch error →", err.message);
    res.status(502).json({ message: "Guardian API error" });
  }
});

app.post("/eco-tips", async (req, res) => {
  const { breakdown, total } = req.body;
  if (!breakdown || total === undefined) {
    return res.status(400).json({ message: "Missing breakdown or total" });
  }

  const sorted = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val]) => `${cat}: ${parseFloat(val).toFixed(2)} kg CO₂e/day`)
    .join(", ");

  const prompt = `A person's daily carbon footprint is ${parseFloat(total).toFixed(1)} kg CO₂e, broken down as: ${sorted}.

Give exactly 3 specific, actionable tips to reduce their emissions. Focus on the highest-impact categories.

Respond with ONLY a JSON array of exactly 3 objects, no explanation:
[{"title":"short 4-6 word action","tip":"one specific practical sentence","impact":"e.g. save ~2 kg CO₂e/day"}]`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text.trim();
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const tips = JSON.parse(text.slice(jsonStart, jsonEnd));
    res.json({ tips });
  } catch (err) {
    console.error("Eco tips error →", err.message);
    res.status(500).json({ message: "Failed to generate tips" });
  }
});

app.listen(PORT, () =>
  console.log(`🌱  Eco API up → http://localhost:${PORT}`)
);
