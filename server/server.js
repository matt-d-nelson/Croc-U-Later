//Import modules
const express = require("express");
const bodyParser = require("body-parser");
const calcRouter = require("./modules/calculator/calculator");

//Constants
const app = express();
const port = process.env.PORT || 5001;

//app configuration
app.listen(port, () => {
  console.log("server up on:", port);
});

app.use(express.static("./server/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", calcRouter);
