import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const stackConfig = new pulumi.Config("static-website");

export const config = {
  // pathToWebsiteContents is a relativepath to the website's contents.
  pathToWebsiteContents: stackConfig.require("pathToWebsiteContents"),
  // targetDomain is the domain/host to serve content at.
  targetDomain: stackConfig.require("targetDomain"),
  // If true create an A record for the www subdomain of targetDomain pointing to the generated cloudfront distribution.
  // If a certificate was generated it will support this subdomain.
  // default: true
  includeWWW: stackConfig.getBoolean("includeWWW") ?? true,
};

export const tenMinutes = 60 * 10;

// Split a domain name into its subdomain and parent domain names.
// e.g. "www.example.com" => "www", "example.com".
function getDomainAndSubdomain(domain: string): {
  subdomain: string;
  parentDomain: string;
} {
  const parts = domain.split(".");
  if (parts.length < 2) {
    throw new Error(`No TLD found on ${domain}`);
  }
  // No subdomain, e.g. awesome-website.com.
  if (parts.length === 2) {
    return { subdomain: "", parentDomain: domain };
  }

  const subdomain = parts[0];
  parts.shift(); // Drop first element.
  return {
    subdomain,
    // Trailing "." to canonicalize domain.
    parentDomain: parts.join(".") + ".",
  };
}

export const domainParts = getDomainAndSubdomain(config.targetDomain);
export const hostedZoneId = aws.route53
  .getZone({ name: domainParts.parentDomain }, { async: true })
  .then((zone) => zone.zoneId);
