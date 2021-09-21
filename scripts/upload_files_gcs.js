let METADATA_DIRECTORY = './metadata/'
let IMAGES_DIRECTORY = './images/'
let BUCKET_NAME = 'funkycrocs'
let IMAGE_BASE_URL = 'https://storage.googleapis.com/funkycrocs/'

const fs = require('fs')
const crypto = require('crypto')
const path = require('path');
const {Storage} = require('@google-cloud/storage');

const storage = new Storage();

async function uploadSingleFile(file_path, file_name) {
  await storage.bucket(BUCKET_NAME).upload(file_path, {
    destination: file_name,
  });
  console.log(`${file_path} uploaded to ${BUCKET_NAME}`)
}

async function uploadFileList(files) {
  for (const file of files) {
    let rawdata = fs.readFileSync(METADATA_DIRECTORY + file)
    let metadata_json = JSON.parse(rawdata)
    var file_name = crypto.randomBytes(20).toString('hex')
    metadata_json["image"] = IMAGE_BASE_URL + file_name
    fs.writeFileSync(METADATA_DIRECTORY + file, JSON.stringify(metadata_json))
    await uploadSingleFile(IMAGES_DIRECTORY + file + ".png", file_name).catch(console.error)
    console.log(`Uploaded ${file}`)
  }
}

fs.readdir(METADATA_DIRECTORY, (err, files) => uploadFileList(files))