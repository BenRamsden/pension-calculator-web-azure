import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
const {
  COSMOS_ENDPOINT,
  COSMOS_KEY,
  COSMOS_DATABASE_NAME,
  COSMOS_CONTAINER_NAME,
} = process.env;

export async function VisitorCounter(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);
  const increment = request.query.get("increment") === "true";

  const client = new CosmosClient({
    endpoint: COSMOS_ENDPOINT,
    key: COSMOS_KEY,
  });
  const collection = client
    .database(COSMOS_DATABASE_NAME)
    .container(COSMOS_CONTAINER_NAME);

  let visitors: number;
  let exists: boolean;
  try {
    const response = await collection.item("visits", undefined).read();
    visitors = response.resource?.visitors ?? 0;
    exists = response.resource !== undefined;
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      body: JSON.stringify({
        error: "Failed to read from Cosmos DB",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (!increment) {
    return {
      body: JSON.stringify({
        visitors,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  const newVisitors = visitors + 1;

  if (exists) {
    console.log("Replacing existing item", { newVisitors });
    await collection.item("visits", undefined).replace({
      id: "visits",
      visitors: newVisitors,
    });
  } else {
    console.log("Creating new item", { newVisitors });
    await collection.items.create({
      id: "visits",
      visitors: newVisitors,
    });
  }

  return {
    body: JSON.stringify({
      visitors: newVisitors,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}

app.http("VisitorCounter", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: VisitorCounter,
});
