import express from "express";
import path from "path";

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`🚂 Express server running on port ${PORT}`);
});
