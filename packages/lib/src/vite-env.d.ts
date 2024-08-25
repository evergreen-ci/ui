import { OpenTelemetryGlobalAttributeWindowProvider } from "./utils/observability/openTelemetryWindowProvider/types";

declare global {
  interface Window {
    openTelemetry: OpenTelemetryGlobalAttributeWindowProvider | null;
  }
}
