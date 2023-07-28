import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";

// Basic Configuration
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const shorturls = {};

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function(_req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.post("/api/shorturl", function(req, res) {
  const id = nanoid(4);
  const original_url = req.body.url;
  
  const isValidUrl = (url) => {
    const urlRegex = /^(http)s?:\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
  };
  
  if (isValidUrl(original_url)) {
    new URL(original_url);
    shorturls[id] = original_url;
    res.json({ original_url, short_url: id });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const id = req.params.id;
  if (id in shorturls) return res.redirect(shorturls[id]);
  res.json({ message: "can't find the shorturl" });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
