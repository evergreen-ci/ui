import { trace } from "@opentelemetry/api";
import { ActionType, Properties, RequiredProperties } from "./types";

const sendEventTrace = <AnalyticsObject extends string>(
  action: ActionType,
  properties: Properties & RequiredProperties<AnalyticsObject>,
) => {
  const tracer = trace.getTracer("analytics");
  tracer.startActiveSpan(action.name, (span) => {
    // use span.setAttribute to set any relevant attributes
    span.setAttributes({
      ...properties,
    });
    console.log("Sending event trace", action.name, properties);
    span.end();
  });
};

export { sendEventTrace };
