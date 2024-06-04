import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as azure_native from "@pulumi/azure-native";
import * as synced_folder from "@pulumi/synced-folder";
// import { functionEndpoint } from "./function";

// Import the program's configuration settings.
const config = new pulumi.Config();
const path = config.get("path") || "../app/dist";
const indexDocument = config.get("indexDocument") || "index.html";
const errorDocument = config.get("errorDocument") || "error.html";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("resourceGroup");

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("sa", {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: storage.SkuName.Standard_LRS,
  },
  kind: storage.Kind.StorageV2,
});

// Configure the storage account as a website.
const website = new azure_native.storage.StorageAccountStaticWebsite(
  "website",
  {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
    indexDocument: indexDocument,
    error404Document: errorDocument,
  }
);

// Use a synced folder to manage the files of the website.
const syncedFolder = new synced_folder.AzureBlobFolder("synced-folder", {
  path: path,
  resourceGroupName: resourceGroup.name,
  storageAccountName: storageAccount.name,
  containerName: website.containerName,
});

// Create a CDN profile.
// const profile = new azure_native.cdn.Profile("profile", {
//   resourceGroupName: resourceGroup.name,
//   sku: {
//     name: "Standard_Microsoft",
//   },
// });

// Pull the hostname out of the storage-account endpoint.
const originHostname = storageAccount.primaryEndpoints.apply(
  (endpoints) => new URL(endpoints.web)
).hostname;

// Create a CDN endpoint to distribute and cache the website.
// const endpoint = new azure_native.cdn.Endpoint("endpoint", {
//   resourceGroupName: resourceGroup.name,
//   profileName: profile.name,
//   isHttpAllowed: false,
//   isHttpsAllowed: true,
//   isCompressionEnabled: true,
//   contentTypesToCompress: [
//     "text/html",
//     "text/css",
//     "application/javascript",
//     "application/json",
//     "image/svg+xml",
//     "font/woff",
//     "font/woff2",
//   ],
//   originHostHeader: originHostname,
//   origins: [
//     {
//       name: storageAccount.name,
//       hostName: originHostname,
//     },
//   ],
// });

// Export the URLs and hostnames of the storage account and CDN.
export const originURL = storageAccount.primaryEndpoints.apply(
  (endpoints) => endpoints.web
);
export { originHostname };
// export const cdnURL = pulumi.interpolate`https://${endpoint.hostName}`;
// export const cdnHostname = endpoint.hostName;
// export { functionEndpoint };
