import express from "express";
import path from "node:path";

const app = express();
app.use(express.static(path.resolve("public")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});
app.get("/sync", (req, res) => {
  res.sendFile(path.resolve("public", "index.sync.html"));
});
app.listen(3000, () => {
  console.log("Server started.");
});
