import { OpenTelemeteryGlobalAttributeWindowProvider } from "utils/observability/types";

declare global {
  interface Window {
    openTelemetry: OpenTelemeteryGlobalAttributeWindowProvider;
  }
}
