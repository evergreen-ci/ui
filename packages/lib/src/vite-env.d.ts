import { OpenTelemetryGlobalAttributeWindowProvider } from "./utils/observability/types";

declare global {
  interface Window {
    openTelemetry: OpenTelemetryGlobalAttributeWindowProvider | null;
  }
}
