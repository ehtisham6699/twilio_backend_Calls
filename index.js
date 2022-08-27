const express = require("express");
const app = express();
require("dotenv").config();
var db = require("./config/database");
var bodyParser = require("body-parser");
var calls = require("./routes/call_route");
const layouts = require("express-ejs-layouts");
const port = process.env.PORT || 3000;
const server = require("http").createServer(app);
let env = process.env.NODE_ENV;

console.log("2@@ dotnev", env);

db.authenticate()
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err.message));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(layouts);
app.set("view engine", "ejs");

//////////////////////////////routes/////////////////////////
app.use("/calls", calls);

if (env === "production") {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`Example app listening at http://localhost`);
  });
} else {
  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
  });
}
