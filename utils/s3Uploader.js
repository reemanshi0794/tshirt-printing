const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = (filePath, key) => {
  const fileStream = fs.createReadStream(filePath);
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: fileStream,
  };

  return s3.upload(params).promise();
};

module.exports = { uploadToS3 };
