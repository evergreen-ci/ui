/// <reference types="vite/client" />
import { AttributeStore } from "@evg-ui/lib/utils";

declare global {
  module "*.graphql" {
    import { DocumentNode } from "graphql";

    const content: DocumentNode;
    export default content;
  }
  interface Window {
    /**
     * `AttributeStore` is an interface that provides a way to set and remove global attributes for use in OpenTelemetry spans.
     * We can use this to add global attributes to all spans and traces
     * This is a global object that is injected into the window object.
     */
    AttributeStore: AttributeStore | null;
  }
}
