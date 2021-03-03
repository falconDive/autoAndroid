const uploadFile = require("../middleware/upload");
const fs = require("fs");
const {execSync} = require('child_process');
const baseUrl = "http://localhost:8080/files/";

function execShellCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(cmd, (error, stdout, stderr) => {
    if (error) {
     console.warn(error);
    }
    resolve(stdout? stdout : stderr);
   });
  });
 }

const generateapk = async (req, res) => {
  try {
    console.log("generateapk");
    await uploadFile(req, res);
    console.log(req.file);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    console.log("Uploaded the file successfully:"+ req.file.originalname);
    /* res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    }); */
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
  
  try {
  
    const parameters = req.body.string1 + " " + req.body.string2 + " " + req.body.string3 + " " + req.body.string4 + " " + req.body.string5 + " " + req.file.originalname ;
    const command = 'bash -c \'../HelloWorld/build.sh '+parameters+'';
    const javaInfo = await execShellCommand(command);

  res.status(200).send({
    message: "APK Generated Successfully ",
  });

  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not generate apkfile: ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/downloads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/downloads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  getListFiles,
  download,
  generateapk
};
