import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import {
  getWebAutoInstrumentations,
  InstrumentationConfigMap,
} from "@opentelemetry/auto-instrumentations-web";
import ReactRouterSpanProcessor from "./ReactRouterSpanProcessor";
import { RouteConfig } from "./ReactRouterSpanProcessor/types";
import { detectGraphqlQuery } from "./utils";
/**
 * Configuration object for the Honeycomb SDK.
 */
interface HoneycombConfig {
  /** The service name for the app we are running e.g. spruce or parsley */
  serviceName: string;
  /** The endpoint for the Honeycomb SDK to send traces to if we are not using the default */
  endpoint: string;
  /** The url for our Honeycomb instrumented server to connect frontend and backend traces together */
  backendURL?: string;
  /** Whether to enable debug mode in the Honeycomb SDK this will enable additional logging and print links to traces */
  debug: boolean;
  /** The INGEST key for the Honeycomb SDK */
  ingestKey: string;
  /** The environment we are running in */
  environment: string;
  /** A config representing all routes the app can have */
  routeConfig: RouteConfig;
  /** A version number indicating which release this is */
  appVersion: string;
}

/**
 * Initializes the Honeycomb SDK with the provided configuration.
 * @param config - The configuration object for the Honeycomb SDK.
 * @param config.ingestKey - The Honeycomb INGEST API key.
 * @param config.backendURL - The backend URL.
 * @param config.debug - Whether to start the SDK in debug mode.
 * @param config.serviceName - The name of the service.
 * @param config.endpoint - The endpoint for the Honeycomb SDK to send traces to if we are not using the default.
 * @param config.environment - The environment we are running in.
 * @param config.routeConfig - A config representing all routes the app can have.
 * @param config.appVersion - A version number indicating which release this is.
 */
const initializeHoneycomb = ({
  appVersion,
  backendURL,
  debug,
  endpoint,
  environment,
  ingestKey,
  routeConfig,
  serviceName,
}: HoneycombConfig) => {
  if (debug && (!ingestKey || !endpoint)) {
    console.warn(
      "Honeycomb INGEST API key or a collector endpoint was not provided. Starting SDK in debug mode. No traces will be sent.",
    );
    return;
  }
  if (!ingestKey && !endpoint) {
    console.error(
      "Honeycomb INGEST API key or a collector endpoint is required to start the SDK in production mode.",
    );
  } else {
    try {
      const userId = localStorage.getItem("userId") ?? undefined;
      const webAutoInstrumentationConfig: InstrumentationConfigMap = {
        "@opentelemetry/instrumentation-document-load": {
          ignoreNetworkEvents: true,
        },
        "@opentelemetry/instrumentation-fetch": {
          // Add GraphQL operation name as an attribute to HTTP traces.
          applyCustomAttributesOnSpan: (span, request) => {
            if (span && request) {
              const { body } = request;
              if (!body || typeof body !== "string") {
                return;
              }
              const graphqlQuery = detectGraphqlQuery(body);
              if (graphqlQuery) {
                span.setAttribute(
                  "graphql.operation_name",
                  graphqlQuery.operationName,
                );
                span.setAttribute("graphql.query_type", graphqlQuery.queryType);
              }
            }
          },
          // Allow connecting frontend & backend traces.
          propagateTraceHeaderCorsUrls: [new RegExp(backendURL || "")],
        },
      };

      const honeycombSdk = new HoneycombWebSDK({
        debug,
        endpoint,
        instrumentations: [
          getWebAutoInstrumentations(webAutoInstrumentationConfig),
        ],
        // Add attributes to all traces.
        resourceAttributes: {
          "user.id": userId,
          environment,
          app_version: appVersion,
        },
        localVisualizations: debug,
        serviceName,
        apiKey: ingestKey,
        spanProcessor: new ReactRouterSpanProcessor(routeConfig),
      });
      honeycombSdk.start();
    } catch (e) {
      console.error(`Could not start Honeycomb SDK: ${e}`);
    }
  }
};

export { initializeHoneycomb };
