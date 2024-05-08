import * as fs from "fs";
import * as path from "path";
import { config } from "./config";
import * as aws from "@pulumi/aws";
import { contentBucket } from "./s3";
import * as mime from "mime";
import * as pulumi from "@pulumi/pulumi";
import { BucketObject } from "@pulumi/aws/s3";
import { local } from "@pulumi/command";
import { cdn } from "./cloudfront";

function crawlDirectory(dir: string, f: (_: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = `${dir}/${file}`;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      crawlDirectory(filePath, f);
    }
    if (stat.isFile()) {
      f(filePath);
    }
  }
}

// Sync the contents of the source directory with the S3 bucket, which will in-turn show up on the CDN.
const webContentsRootPath = path.join(
  process.cwd(),
  config.pathToWebsiteContents
);

const bucketObjects: BucketObject[] = [];

crawlDirectory(webContentsRootPath, (filePath: string) => {
  const relativeFilePath = filePath.replace(webContentsRootPath + "/", "");
  const bucketObject = new aws.s3.BucketObject(
    relativeFilePath,
    {
      key: relativeFilePath,

      acl: "public-read",
      bucket: contentBucket,
      contentType: mime.getType(filePath) || undefined,
      source: new pulumi.asset.FileAsset(filePath),
    },
    {
      parent: contentBucket,
    }
  );

  bucketObjects.push(bucketObject);
});

const { stdout, stderr } = new local.Command(
  "invalidate",
  {
    create: pulumi.interpolate`aws cloudfront create-invalidation --distribution-id ${cdn.id} --paths "/*"`,
    triggers: bucketObjects,
  },
  {
    dependsOn: bucketObjects,
  }
);

pulumi.all([stdout, stderr]).apply(([stdout, stderr]) => {
  if (stderr) {
    console.error(stderr);
  }
});
