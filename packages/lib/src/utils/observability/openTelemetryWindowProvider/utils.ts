import { OpenTelemetryWindowProvider } from ".";

/**
 * Injects the OpenTelemetry provider into the window object.
 *
 */
const injectOpenTelemetryProviderIntoWindow = () => {
  console.info("Injecting OpenTelemetry provider into window object");
  if (!window.openTelemetry) {
    window.openTelemetry = new OpenTelemetryWindowProvider();
  } else {
    console.warn("OpenTelemetry provider already exists in window");
  }
};

export { injectOpenTelemetryProviderIntoWindow };
