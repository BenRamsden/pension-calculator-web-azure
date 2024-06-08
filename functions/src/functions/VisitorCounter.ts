import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function VisitorCounter(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  return {
    body: JSON.stringify({
      visitors: 0,
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
