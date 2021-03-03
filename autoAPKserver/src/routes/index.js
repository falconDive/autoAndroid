const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.post("/generateapk", controller.generateapk);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);

  app.use(router);
};

module.exports = routes;
