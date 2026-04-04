const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
let logs = [];
const filePath = __dirname + "/data.json";
if (fs.existsSync(filePath)) {
  logs = JSON.parse(fs.readFileSync(filePath));
}
app.post("/submit", (req, res) => {
  const { name, date, count } = req.body;

  if (!name || !count) {
    return res.status(400).json({ error: "Invalid input" });
  }

  logs.push({
    name,
    date,
    count: Number(count)
  });

  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

  res.json({ message: "Saved successfully" });
});

app.get("/user/:name", (req, res) => {
  const name = req.params.name;

  const total = logs
    .filter(log => log.name === name)
    .reduce((sum, log) => sum + log.count, 0);

  res.json({ total });
});

app.get((req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running");
});