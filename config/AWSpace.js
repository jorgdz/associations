"use strict";
var AWS = require("aws-sdk");
var fs = require("fs");
var path = require("path");
const Image = require("../src/Models").Image;

function init() {
  AWS.config.update({
    accessKeyId: process.env.SPACE_KEY,
    secretAccessKey: process.env.SPACE_SECRET,
    region: process.env.SPACE_REGION,
  });

  let space = new AWS.S3({
    endpoint: process.env.SPACE_ENDPOINT,
  });

  return space;
}

exports.uploadSingle = (file_path, targetName, mimetype) => {
  return new Promise((resolve, reject) => {
    let space = init();

    const uploadParams = {
      Bucket: process.env.SPACE_BUCKET,
      ContentType: mimetype,
      ACL: "public-read",
      Key: targetName,
      Body: fs.createReadStream(file_path),
    };

    space.upload(uploadParams, function (err, data) {
      if (err) {
        console.log("Error", err);
        return reject(err);
      }
      if (data) {
        console.log("Upload Success", data);
        return resolve(data);
      }
    });
  });
};

exports.uploadMultiple = (files = [], id) => {
  return new Promise((resolve, reject) => {
    let space = init();
    let arrayFiles = [];

    for (let x = 0; x < files.length; x++) {
      const uploadParams = {
        Bucket: process.env.SPACE_BUCKET,
        ContentType: files[x].mimetype,
        ACL: "public-read",
        Key: files[x].filename,
        Body: fs.createReadStream(files[x].path),
      };

      space.upload(uploadParams, function (err, data) {
        if (err) {
          console.log("Error", err);
          return reject(err);
        }
        if (data) {
          console.log("Upload Success", data);
          Image.create({
            name: data.key.split("shop/")[1],
            storageUrl: data.Location,
            principal: false,
            ProductId: id,
          }).then((imageCreated) => {
            console.log(imageCreated);
            arrayFiles.push(imageCreated);
          });
        }
      });
    }
    return resolve(arrayFiles);
  });
};

exports.deleteSingle = (targetName) => {
  return new Promise((resolve, reject) => {
    let space = init();

    space.deleteObject(
      { Bucket: process.env.SPACE_BUCKET, Key: targetName },
      function (err, data) {
        if (err) return reject(err);
        else return resolve(data);
      }
    );
  });
};
