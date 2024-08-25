import { OpenTelemetryWindowProvider } from ".";

/**
 * Injects the OpenTelemetry provider into the window object.
 *
 */
const injectOpenTelemetryProviderIntoWindow = () => {
  console.info("Injecting OpenTelemetry provider into window object");
  window.openTelemetry = new OpenTelemetryWindowProvider();
};

export { injectOpenTelemetryProviderIntoWindow };
