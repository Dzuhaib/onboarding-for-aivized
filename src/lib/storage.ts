import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ENDPOINT = process.env.S3_ENDPOINT;
const REGION = process.env.S3_REGION ?? "AE";
const BUCKET = process.env.S3_BUCKET ?? "";
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID ?? "";
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY ?? "";

const s3Client = new S3Client({
  region: REGION,
  endpoint: ENDPOINT || undefined,
  forcePathStyle: Boolean(ENDPOINT),
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export interface StoredUpload {
  key: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

function buildFileUrl(key: string) {
  if (ENDPOINT) {
    return `${ENDPOINT}/${BUCKET}/${key}`;
  }
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

export async function uploadFileToStorage(params: {
  token: string;
  name: string;
  mimeType: string;
  size: number;
  content: Buffer;
}): Promise<StoredUpload> {
  const safeName = params.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `onboarding/${params.token}/${Date.now()}-${safeName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: params.content,
      ContentType: params.mimeType,
      ACL: "private",
    })
  );

  return {
    key,
    url: buildFileUrl(key),
    name: safeName,
    size: params.size,
    mimeType: params.mimeType,
  };
}
