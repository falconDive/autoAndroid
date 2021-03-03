const cors = require("cors");
const express = require("express");
var bodyParser = require('body-parser');
const formidable = require('express-formidable');

const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(formidable());

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let port = 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
