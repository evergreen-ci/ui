import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";

interface HoneycombConfig {
  serviceName: string;
  endpoint: string;
  uiUrl: string;
  debug: boolean;
  apiKey: string;
}
const initializeHoneycomb = ({
  apiKey,
  debug,
  endpoint,
  serviceName,
  uiUrl,
}: HoneycombConfig) => {
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
              const bodyJson = JSON.parse(body);
              console.log(bodyJson);
              const { operationName = "Could not detect operation" } = bodyJson;
              span.setAttribute("graphql.operation_name", operationName);
              console.log(span);
            }
          },

          // Allow connecting frontend & backend traces.
          // propagateTraceHeaderCorsUrls: [new RegExp(getUiUrl())],
        },
      }),

      new UserInteractionInstrumentation(),
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
};

export { initializeHoneycomb };
