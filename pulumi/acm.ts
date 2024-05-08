import * as aws from "@pulumi/aws";
import { config, hostedZoneId, tenMinutes } from "./config";

const eastRegion = new aws.Provider("east", {
  profile: aws.config.profile,
  region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
});

// if config.includeWWW include required subjectAlternativeNames to support the www subdomain
const certificateConfig: aws.acm.CertificateArgs = {
  domainName: config.targetDomain,
  validationMethod: "DNS",
  subjectAlternativeNames: config.includeWWW
    ? [`www.${config.targetDomain}`]
    : [],
};

const certificate = new aws.acm.Certificate("certificate", certificateConfig, {
  provider: eastRegion,
});

/**
 *  Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
 *  See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
 */
const certificateValidationDomain = new aws.route53.Record(
  `${config.targetDomain}-validation`,
  {
    name: certificate.domainValidationOptions[0].resourceRecordName,
    zoneId: hostedZoneId,
    type: certificate.domainValidationOptions[0].resourceRecordType,
    records: [certificate.domainValidationOptions[0].resourceRecordValue],
    ttl: tenMinutes,
  }
);

// if config.includeWWW ensure we validate the www subdomain as well
let subdomainCertificateValidationDomain;
if (config.includeWWW) {
  subdomainCertificateValidationDomain = new aws.route53.Record(
    `${config.targetDomain}-validation2`,
    {
      name: certificate.domainValidationOptions[1].resourceRecordName,
      zoneId: hostedZoneId,
      type: certificate.domainValidationOptions[1].resourceRecordType,
      records: [certificate.domainValidationOptions[1].resourceRecordValue],
      ttl: tenMinutes,
    }
  );
}

// if config.includeWWW include the validation record for the www subdomain
const validationRecordFqdns =
  subdomainCertificateValidationDomain === undefined
    ? [certificateValidationDomain.fqdn]
    : [
        certificateValidationDomain.fqdn,
        subdomainCertificateValidationDomain.fqdn,
      ];

/**
 * This is a _special_ resource that waits for ACM to complete validation via the DNS record
 * checking for a status of "ISSUED" on the certificate itself. No actual resources are
 * created (or updated or deleted).
 *
 * See https://www.terraform.io/docs/providers/aws/r/acm_certificate_validation.html for slightly more detail
 * and https://github.com/terraform-providers/terraform-provider-aws/blob/master/aws/resource_aws_acm_certificate_validation.go
 * for the actual implementation.
 */
const certificateValidation = new aws.acm.CertificateValidation(
  "certificateValidation",
  {
    certificateArn: certificate.arn,
    validationRecordFqdns: validationRecordFqdns,
  },
  { provider: eastRegion }
);

export const certificateArn = certificateValidation.certificateArn;
