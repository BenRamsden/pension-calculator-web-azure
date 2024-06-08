import * as authorization from "@pulumi/azure-native/authorization";
import * as documentdb from "@pulumi/azure-native/documentdb";
import * as resources from "@pulumi/azure-native/resources";
import * as web from "@pulumi/azure-native/web";
import * as pulumi from "@pulumi/pulumi";

const resourceGroup = new resources.ResourceGroup("logicappdemo-rg");

export const cosmosAccount = new documentdb.DatabaseAccount(
  "logicappdemo-cdb",
  {
    resourceGroupName: resourceGroup.name,
    databaseAccountOfferType: documentdb.DatabaseAccountOfferType.Standard,
    locations: [
      {
        locationName: resourceGroup.location,
        failoverPriority: 0,
      },
    ],
    consistencyPolicy: {
      defaultConsistencyLevel: documentdb.DefaultConsistencyLevel.Session,
    },
  }
);

export const cosmosDb = new documentdb.SqlResourceSqlDatabase("sqldb", {
  resourceGroupName: resourceGroup.name,
  accountName: cosmosAccount.name,
  resource: {
    id: "sqldb",
  },
});

export const cosmosDbContainer = new documentdb.SqlResourceSqlContainer(
  "container",
  {
    resourceGroupName: resourceGroup.name,
    accountName: cosmosAccount.name,
    databaseName: cosmosDb.name,
    resource: {
      id: "container",
      partitionKey: {
        paths: ["/myPartitionKey"],
        kind: "Hash",
      },
    },
  }
);

export const cosmosDbAccountKeys = documentdb.listDatabaseAccountKeysOutput({
  accountName: cosmosAccount.name,
  resourceGroupName: resourceGroup.name,
});

// const clientConfig = pulumi.output(authorization.getClientConfig());
//
// const apiId = pulumi.interpolate`/subscriptions/${clientConfig.subscriptionId}/providers/Microsoft.Web/locations/${resourceGroup.location}/managedApis/documentdb`;
//
// export const cosmosDbConnection = new web.Connection("cosmosdbConnection", {
//   resourceGroupName: resourceGroup.name,
//   properties: {
//     displayName: "cosmosdb_connection",
//     api: {
//       id: apiId,
//     },
//     parameterValues: {
//       databaseAccount: cosmosAccount.name,
//       accessKey: cosmosDbAccountKeys.primaryMasterKey,
//     },
//   },
// });
