import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as azure_native from "@pulumi/azure-native";
import * as synced_folder from "@pulumi/synced-folder";
import { Function } from "./function";

// Import the program's configuration settings.
const config = new pulumi.Config();
const path = config.get("path") || "../app/dist";
const indexDocument = config.get("indexDocument") || "index.html";
const errorDocument = config.get("errorDocument") || "error.html";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("resourceGroup");

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("pensioncalc", {
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
new synced_folder.AzureBlobFolder("synced-folder", {
  path: path,
  resourceGroupName: resourceGroup.name,
  storageAccountName: storageAccount.name,
  containerName: website.containerName,
});

// Export Storage Account URLs
export const originURL = storageAccount.primaryEndpoints.apply(
  (endpoints) => endpoints.web.replace(/\/$/, "") // Remove trailing slash
);

const { functionEndpoint: functionEndpoint } = new Function(
  "api",
  {},
  {
    codePath: "../functions/functions.zip",
    blobName: "ts",
    allowedOrigins: [originURL, "http://localhost:3000"],
  }
);

// Export Function endpoints
// Note: if this changes app/.env must be updated, then deploy the new frontend app
export { functionEndpoint };
