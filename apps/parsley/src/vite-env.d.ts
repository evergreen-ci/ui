/// <reference types="vite/client" />
import { OpenTelemetryGlobalAttributeWindowProvider } from "@evg-ui/lib/utils/observability/types";

declare global {
  module "*.graphql" {
    import { DocumentNode } from "graphql";

    const content: DocumentNode;
    export default content;
  }
  interface Window {
    openTelemetry: OpenTelemetryGlobalAttributeWindowProvider | null;
  }
}
