import { OpenTelemetryAttributeStore } from ".";

/**
 * Injects the OpenTelemetry Attribute store into the window object.
 */
const injectOpenTelemetryAttributeStoreIntoWindow = () => {
  console.info("Injecting OpenTelemetry provider into window object");
  if (!window.AttributeStore) {
    window.AttributeStore = new OpenTelemetryAttributeStore();
  } else {
    console.warn("OpenTelemetry provider already exists in window");
  }
};

export { injectOpenTelemetryAttributeStoreIntoWindow };
