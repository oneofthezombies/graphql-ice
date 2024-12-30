import express from "express";
import path from "node:path";

const app = express();
app.use(express.static(path.resolve("public")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});
app.listen(3000, () => {
  console.log("Server started.");
});
