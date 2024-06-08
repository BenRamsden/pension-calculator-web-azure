# pension-calculator-web-azure cosmosdb

## Pre-requisites

### Import CosmosDB emulator TLS/SSL Certificate

```shell
curl -k https://localhost:8081/_explorer/emulator.pem > ~/emulatorcert.crt
open ~/emulatorcert.crt
```

## Run CosmosDB locally

```shell
docker compose up
```

## Stop CosmosDB locally

```shell
docker compose down
```
