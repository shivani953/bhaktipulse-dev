const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(__dirname + "/public"));

let logs = [];
const filePath = __dirname + "/data.json";

if (fs.existsSync(filePath)) {
  logs = JSON.parse(fs.readFileSync(filePath));
}

app.post("/submit", (req, res) => {
  const { name, date, count } = req.body;
  if (!name || !count || count <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const entry = {
    name: name.trim(),
    date,
    count: Number(count)
  };

  logs.push(entry);

  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

  res.json({ message: "Saved successfully" });
});

app.get("/user/:name", (req, res) => {
  const name = req.params.name;

  const total = logs
    .filter(log => log.name.toLowerCase() === name.toLowerCase())
    .reduce((sum, log) => sum + log.count, 0);

  res.json({ total });
});
app.get("/total", (req, res) => {
  const total = logs.reduce((sum, log) => sum + log.count, 0);
  res.json({ total });
});

app.get("/today", (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const total = logs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.count, 0);

  res.json({ total });
});

app.get("/users", (req, res) => {
  const uniqueUsers = [...new Set(logs.map(log => log.name.toLowerCase()))];
  res.json({ count: uniqueUsers.length });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:" + PORT);
});