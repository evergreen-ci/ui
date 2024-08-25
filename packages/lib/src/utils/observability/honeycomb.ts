import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { detectGraphqlQuery } from "./utils";

/**
 * Configuration object for the Honeycomb SDK.
 */
interface HoneycombConfig {
  /** The service name for the app we are running e.g. spruce or parsley */
  serviceName: string;
  /** The endpoint for the Honeycomb SDK to connect to if we are not using the default */
  endpoint: string;
  backendURL?: string;
  debug: boolean;
  /** The API key for the Honeycomb SDK */
  apiKey: string;
}

/**
 * Initializes the Honeycomb SDK with the provided configuration.
 * @param config - The configuration object for the Honeycomb SDK.
 * @param config.apiKey - The Honeycomb API key.
 * @param config.backendURL - The backend URL.
 * @param config.debug - Whether to start the SDK in debug mode.
 * @param config.serviceName - The name of the service.
 */
const initializeHoneycomb = ({
  apiKey,
  backendURL,
  debug,
  serviceName,
}: HoneycombConfig) => {
  if (debug && !apiKey) {
    console.warn(
      "Honeycomb API key was not provided. Starting SDK in debug mode.",
    );
    return;
  }
  if (!apiKey) {
    console.error(
      "Honeycomb API key is required to start the SDK in production mode.",
    );
  } else {
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
  }
};

export { initializeHoneycomb };
