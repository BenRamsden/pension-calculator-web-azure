// contentBucket is the S3 bucket that the website's contents will be stored in.
import * as aws from "@pulumi/aws";
import { config } from "./config";
import * as pulumi from "@pulumi/pulumi";

// Site content bucket
export const contentBucket = new aws.s3.Bucket("contentBucket", {
  bucket: config.targetDomain,
  website: {
    indexDocument: "index.html",
    errorDocument: "404.html",
  },
});

export const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
  "originAccessIdentity",
  {
    comment: "this is needed to setup s3 polices and make s3 not public.",
  }
);

new aws.s3.BucketPolicy("bucketPolicy", {
  bucket: contentBucket.id, // refer to the bucket created earlier
  policy: pulumi
    .all([originAccessIdentity.iamArn, contentBucket.arn])
    .apply(([oaiArn, bucketArn]) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: oaiArn,
            }, // Only allow Cloudfront read access.
            Action: ["s3:GetObject"],
            Resource: [`${bucketArn}/*`], // Give Cloudfront access to the entire bucket.
          },
        ],
      })
    ),
});

// Logs bucket for CDN request logs
export const logsBucket = new aws.s3.Bucket("requestLogs", {
  bucket: `${config.targetDomain}-logs`,
});
