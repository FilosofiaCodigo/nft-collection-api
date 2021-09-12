let METADATA_DIRECTORY = './../metadata/'
const fs = require('fs')
const path = require('path')
const MAX_SUPPLY = 20

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

async function shuffle(files) {
  for (const file of files) {
    console.log(`Shuffling ${file}`);
    let file_path1 = METADATA_DIRECTORY + file
    let file_path2 = METADATA_DIRECTORY + getRandomInt(MAX_SUPPLY)
    let rawdata1 = fs.readFileSync(file_path1)
    let metadata_json1 = JSON.parse(rawdata1)
    let rawdata2 = fs.readFileSync(file_path2)
    let metadata_json2 = JSON.parse(rawdata2)
    //swap
    let image_temp = metadata_json1["image"]
    let attributes_temp = metadata_json1["attributes"]
    metadata_json1["image"] = metadata_json2["image"]
    metadata_json1["attributes"] = metadata_json2["attributes"]
    metadata_json2["image"] = image_temp
    metadata_json2["attributes"] = attributes_temp
    fs.writeFileSync(file_path1, JSON.stringify(metadata_json1))
    fs.writeFileSync(file_path2, JSON.stringify(metadata_json2))
  }
}

fs.readdir(METADATA_DIRECTORY, (err, files) => shuffle(files))