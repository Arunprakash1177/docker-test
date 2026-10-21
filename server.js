// Server Checklist - a tiny Node.js + Express app.
// Tasks are stored in a JSON file, so they survive restarts.

const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "127.0.0.1";
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

fs.mkdirSync(DATA_DIR, { recursive: true });

function loadTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/tasks", (req, res) => res.json(loadTasks()));

app.post("/api/tasks", (req, res) => {
  const title = String(req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  const tasks = loadTasks();
  const task = { id: Date.now(), title, done: false };
  tasks.push(task);
  saveTasks(tasks);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "not found" });
  task.done = !task.done;
  saveTasks(tasks);
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const tasks = loadTasks().filter((t) => t.id !== Number(req.params.id));
  saveTasks(tasks);
  res.status(204).end();
});

app.listen(PORT, HOST, () => {
  console.log(`Server Checklist listening on http://${HOST}:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
