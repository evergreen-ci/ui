import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { getElementName } from "./utils";

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
                const bodyJson = JSON.parse(body);
                console.log(bodyJson);
                const { operationName = "Could not detect operation" } =
                  bodyJson;
                span.setAttribute("graphql.operation_name", operationName);
                console.log(span);
              }
            },

            // Allow connecting frontend & backend traces.
            // propagateTraceHeaderCorsUrls: [new RegExp(getUiUrl())],
          },
        }),

        new UserInteractionInstrumentation({
          shouldPreventSpanCreation: (event, element, span) => {
            span.setAttribute("target.id", element.id);
            span.setAttribute(
              "target.data-cy",
              element.getAttribute("data-cy") ?? "no data-cy",
            );

            span.updateName(`${event}: ${getElementName(element)}`);
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
    console.error(`Could not start honeycomb SDK ${e}`);
  }
};

export { initializeHoneycomb };
