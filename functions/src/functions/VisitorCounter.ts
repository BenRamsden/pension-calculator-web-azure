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
  const key = request.query.get("key");
  if (key === undefined) {
    return {
      status: 400,
      body: JSON.stringify({
        error: "Please provide a key",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  const client = new CosmosClient({
    endpoint: COSMOS_ENDPOINT,
    key: COSMOS_KEY,
    // connectionPolicy: { preferredLocations: [location] },
  });
  const collection = client
    .database(COSMOS_DATABASE_NAME)
    .container(COSMOS_CONTAINER_NAME);

  let resource;
  try {
    const response = await collection.item(key, undefined).read();
    resource = response.resource;
  } catch (error) {
    console.log(error);
    resource = null;
  }

  return {
    body: JSON.stringify({
      visitors: 0,
      resource,
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
