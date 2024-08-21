import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { detectGraphqlQuery } from "./utils";

interface HoneycombConfig {
  serviceName: string;
  endpoint: string;
  backendURL?: string;
  debug: boolean;
  apiKey: string;
}
const initializeHoneycomb = ({
  apiKey,
  backendURL,
  debug,
  serviceName,
}: HoneycombConfig) => {
  try {
    const userId = localStorage.getItem("userId") ?? undefined;
    const honeycombSdk = new HoneycombWebSDK({
      debug,
      // endpoint: endpoint,
      instrumentations: [
        getWebAutoInstrumentations({
          "@opentelemetry/instrumentation-fetch": {
            // Add GraphQL operation name as an attribute to HTTP traces.
            applyCustomAttributesOnSpan: (span, request) => {
              if (span && request) {
                const body = request.body as string;
                const graphqlQuery = detectGraphqlQuery(body);
                if (graphqlQuery) {
                  span.setAttribute(
                    "graphql.operation_name",
                    graphqlQuery.operationName,
                  );
                  span.setAttribute(
                    "graphql.query_type",
                    graphqlQuery.queryType,
                  );
                }
              }
            },

            // Allow connecting frontend & backend traces.
            propagateTraceHeaderCorsUrls: [backendURL || ""],
          },
          "@opentelemetry/instrumentation-document-load": {
            ignoreNetworkEvents: true,
          },
        }),
      ],
      // Add user.id as an attribute to all traces.
      resourceAttributes: {
        "user.id": userId,
      },
      localVisualizations: debug,
      serviceName,
      apiKey,
    });
    honeycombSdk.start();
  } catch (e) {
    console.error(`Could not start Honeycomb SDK: ${e}`);
  }
};

export { initializeHoneycomb };
