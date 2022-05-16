// const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");

const profileRoutes = require("./routes/profile");
const searchRoutes = require("./routes/search");
const chatRoutes = require("./routes/chat");

// const homeRoutes = require("./routes/Home");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});



//
app.use("/profile", profileRoutes);
app.use("/search", searchRoutes);
// app.use("/home", homeRoutes);
app.use("/chat",chatRoutes)
//


app.listen(8080, () => {
  console.log("Listening on port 8080");
});
  