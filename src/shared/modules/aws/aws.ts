import { S3 } from 'aws-sdk';

export async function uploadSongs(
  files: Express.Multer.File[],
): Promise<string[]> {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  });

  return Promise.all(
    files.map(async (file) => {
      const filename = `${Date.now()}-${file.originalname}`;

      const upload = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `music/${filename}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();

      return upload.Location; 
    }),
  );
}