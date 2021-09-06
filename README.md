GOOGLE_APPLICATION_CREDENTIALS=gcs.json node iterate.js

gsutil -m setmeta -h "Content-Type: image/png" -h "Content-Disposition: inline;" gs://funkycrocs/*

http://134.209.33.178:3000/