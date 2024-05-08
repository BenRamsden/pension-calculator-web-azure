import * as aws from "@pulumi/aws";
import { config, domainParts } from "./config";
import { cdn } from "./cloudfront";

function createAliasRecord(
  targetDomain: string,
  distribution: aws.cloudfront.Distribution
): aws.route53.Record {
  const hostedZoneId = aws.route53
    .getZone({ name: domainParts.parentDomain }, { async: true })
    .then((zone) => zone.zoneId);
  return new aws.route53.Record(targetDomain, {
    name: domainParts.subdomain,
    zoneId: hostedZoneId,
    type: "A",
    aliases: [
      {
        name: distribution.domainName,
        zoneId: distribution.hostedZoneId,
        evaluateTargetHealth: true,
      },
    ],
  });
}

function createWWWAliasRecord(
  targetDomain: string,
  distribution: aws.cloudfront.Distribution
): aws.route53.Record {
  const hostedZoneId = aws.route53
    .getZone({ name: domainParts.parentDomain }, { async: true })
    .then((zone) => zone.zoneId);

  return new aws.route53.Record(`${targetDomain}-www-alias`, {
    name: `www.${targetDomain}`,
    zoneId: hostedZoneId,
    type: "A",
    aliases: [
      {
        name: distribution.domainName,
        zoneId: distribution.hostedZoneId,
        evaluateTargetHealth: true,
      },
    ],
  });
}

const aRecord = createAliasRecord(config.targetDomain, cdn);
if (config.includeWWW) {
  const cnameRecord = createWWWAliasRecord(config.targetDomain, cdn);
}
