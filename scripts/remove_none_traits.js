let METADATA_DIRECTORY = './../metadata/'
const fs = require('fs')
const path = require('path')

function removeNonesFromAttributes(attributes) {
  var i = 0;
  while (i < attributes.length) {
    if (attributes[i].value === "None") {
      attributes.splice(i, 1);
    } else {
      ++i;
    }
  }
  return attributes;
}

async function removeAllNones(files) {
  for (const file of files) {
    console.log(`Removing "none" from ${file}`)
    let file_path = METADATA_DIRECTORY + file
    let rawdata = fs.readFileSync(file_path)
    let metadata_json = JSON.parse(rawdata)
    metadata_json["attributes"] = removeNonesFromAttributes(metadata_json["attributes"])
    console.log(metadata_json["attributes"].length)
    console.log(metadata_json["attributes"])
    fs.writeFileSync(file_path, JSON.stringify(metadata_json))
  }
}

fs.readdir(METADATA_DIRECTORY, (err, files) => removeAllNones(files))