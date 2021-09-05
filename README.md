GOOGLE_APPLICATION_CREDENTIALS=gcs.json node iterate.js

gsutil -m setmeta -h "Content-Type: image/png" -h "Content-Disposition: inline;" gs://funkycrocs/*