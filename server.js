const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//static
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/musics", express.static(path.join(__dirname, "musics")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
