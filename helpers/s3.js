const { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
}
);

async function uploadToS3Bucket(bucketName, key, buffer, type) {
    const uploadParams = {
        Bucket: bucketName,
        Body: buffer,
        Key: key,
        ContentType: type
    };
    return await s3Client.send(new PutObjectCommand(uploadParams));
}



async function getFileSignedUrl(bucketName, key, expiresIn) {
    return await getSignedUrl(
        s3Client,
        new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        }),
        { expiresIn: 150 }
    );
}


async function deleteFileFromS3Bucket(bucketName, key) {
    const deleteParams = {
        Bucket: bucketName,
        Key: key,
    };
    return await s3Client.send(new DeleteObjectCommand(deleteParams));
}

module.exports = {
    uploadToS3Bucket,
    getFileSignedUrl,
    deleteFileFromS3Bucket
};