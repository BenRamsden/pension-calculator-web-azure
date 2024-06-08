# pension-calculator-web-azure functions

## Pre-requisites

- Install Azure Functions Core Tools

```shell
brew tap azure/functions
brew install azure-functions-core-tools@4
```

- Create a local.settings.json file

```shell
touch functions/local.settings.json
```

- Add the following content

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "AzureWebJobsStorage": "",
    "COSMOS_ENDPOINT": "<populate>",
    "COSMOS_KEY": "<populate>",
    "COSMOS_DATABASE_NAME": "<populate>",
    "COSMOS_CONTAINER_NAME": "<populate>"
  }
}
```

## Run functions locally

```shell
cd functions
yarn
yarn start
```

## Deploy functions

```shell
cd functions
yarn build
func pack
cd ../pulumi
pulumi up
```
