import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import {
  WebVitalsInstrumentation,
  getWebAutoInstrumentations,
} from "@opentelemetry/auto-instrumentations-web";

const initializeHoneycomb = () => {
  const userId = localStorage.getItem("userId") ?? undefined;

  const honeycombSdk = new HoneycombWebSDK({
    endpoint: "https://<your-collector>:4318/v1/traces",
    instrumentations: [
      getWebAutoInstrumentations({
        "@opentelemetry/instrumentation-fetch": {
          // Add GraphQL operation name as an attribute to HTTP traces.
          applyCustomAttributesOnSpan: (span, request) => {
            if (span && request) {
              const body = request.body as string;
              const bodyJson = JSON.parse(body);
              const { operationName = "Could not detect operation" } = bodyJson;
              span.setAttribute("graphql.operation_name", operationName);
            }
          },

          // Allow connecting frontend & backend traces.
          propagateTraceHeaderCorsUrls: [new RegExp(getUiUrl())],
        },
      }),
      new WebVitalsInstrumentation(),
    ],
    // Add user.id as an attribute to all traces.
    resourceAttributes: {
      "user.id": userId,
    },

    serviceName: "<your-service-name>",
  });

  honeycombSdk.start();
};

export { initializeHoneycomb };
