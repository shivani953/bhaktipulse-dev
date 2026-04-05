const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

let logs = [];
const filePath = path.join(__dirname, "data.json");

if (fs.existsSync(filePath)) {
  logs = JSON.parse(fs.readFileSync(filePath));
}

// Submit
app.post("/submit", (req, res) => {
  const { name, date, count } = req.body;

  if (!name || !count || count <= 0) {
    return res.status(400).json({ error: "Invalid" });
  }

  logs.push({ name, date, count: Number(count) });

  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

  res.json({ message: "Saved" });
});

// Routes
app.get("/user/:name", (req, res) => {
  const total = logs
    .filter(l => l.name.toLowerCase() === req.params.name.toLowerCase())
    .reduce((s, l) => s + l.count, 0);

  res.json({ total });
});

app.get("/total", (req, res) => {
  res.json({ total: logs.reduce((s, l) => s + l.count, 0) });
});

app.get("/today", (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const total = logs
    .filter(l => l.date === today)
    .reduce((s, l) => s + l.count, 0);

  res.json({ total });
});

app.get("/users", (req, res) => {
  const users = [...new Set(logs.map(l => l.name.toLowerCase()))];
  res.json({ count: users.length });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));