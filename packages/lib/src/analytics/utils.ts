import { trace } from "@opentelemetry/api";
import { ActionType, AnalyticsProperties } from "./types";

/**
 * `sendEventTrace` is a function that sends an event to our analytics provider in the form of a OTEL trace
 * @param action - The action to send to our analytics provider
 * @param action.name - The name of the action to send to our analytics provider
 * @param properties - The properties to send with the event
 */
export const sendEventTrace = <A extends ActionType>(
  { name, ...actionProps }: A,
  properties: AnalyticsProperties,
) => {
  const { AttributeStore } = window;
  if (!AttributeStore) {
    console.error("AttributeStore not found on window object");
    return;
  }
  const globalAttributes = AttributeStore.getGlobalAttributes() ?? {};
  const tracer = trace.getTracer("analytics");

  tracer.startActiveSpan(name, (span) => {
    span.setAttributes({
      ...globalAttributes,
      ...properties,
      ...actionProps,
    });
    span.end();
  });
};
