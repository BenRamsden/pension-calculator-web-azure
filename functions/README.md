# pension-calculator-web-azure functions

## Pre-requisites

Install Azure Functions Core Tools

```shell
brew tap azure/functions
brew install azure-functions-core-tools@4
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
