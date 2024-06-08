import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as web from "@pulumi/azure-native/web";
import { getConnectionString, signedBlobReadUrl } from "./helpers";
import { ComponentResource } from "@pulumi/pulumi";
import {
  cosmosAccount,
  cosmosDb,
  cosmosDbAccountKeys,
  cosmosDbContainer,
} from "./cosmosdb";

// Create a separate resource group for this example.
const resourceGroup = new resources.ResourceGroup("functions");

// Storage account is required by Function App.
// Also, we will upload the function code to the same storage account.
const storageAccount = new storage.StorageAccount("functions", {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: storage.SkuName.Standard_LRS,
  },
  kind: storage.Kind.StorageV2,
});

// Function code archives will be stored in this container.
const codeContainer = new storage.BlobContainer("functions", {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
});

const plan = new web.AppServicePlan("functions", {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: "Y1",
    tier: "Dynamic",
  },
});

const storageConnectionString = getConnectionString(
  resourceGroup.name,
  storageAccount.name
);

export class Function extends ComponentResource {
  functionEndpoint: pulumi.Output<string>;

  constructor(
    name: string,
    opts: pulumi.ComponentResourceOptions,
    args: {
      codePath: string;
      blobName: string;
      allowedOrigins: pulumi.Input<pulumi.Input<string>[]>;
    }
  ) {
    super("custom:functions:Function", name, {}, opts);

    const codeBlob = new storage.Blob(
      args.blobName,
      {
        resourceGroupName: resourceGroup.name,
        accountName: storageAccount.name,
        containerName: codeContainer.name,
        source: new pulumi.asset.FileArchive(args.codePath),
      },
      {
        parent: this,
      }
    );

    const codeBlobUrl = signedBlobReadUrl(
      codeBlob,
      codeContainer,
      storageAccount,
      resourceGroup
    );

    const app = new web.WebApp(
      name,
      {
        resourceGroupName: resourceGroup.name,
        serverFarmId: plan.id,
        kind: "functionapp",
        siteConfig: {
          appSettings: [
            { name: "AzureWebJobsFeatureFlags", value: "EnableWorkerIndexing" },
            { name: "AzureWebJobsStorage", value: storageConnectionString },
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
            { name: "WEBSITE_NODE_DEFAULT_VERSION", value: "~18" },
            { name: "WEBSITE_RUN_FROM_PACKAGE", value: codeBlobUrl },
            { name: "COSMOS_ENDPOINT", value: cosmosAccount.documentEndpoint },
            { name: "COSMOS_KEY", value: cosmosDbAccountKeys.primaryMasterKey },
            { name: "COSMOS_DATABASE_NAME", value: cosmosDb.name },
            { name: "COSMOS_CONTAINER_NAME", value: cosmosDbContainer.name },
          ],
          http20Enabled: true,
          nodeVersion: "~18",
          cors: {
            allowedOrigins: args.allowedOrigins,
            supportCredentials: false,
          },
        },
      },
      {
        parent: this,
      }
    );

    this.functionEndpoint = pulumi.interpolate`https://${app.defaultHostName}/api/<endpoint>`;
  }
}
