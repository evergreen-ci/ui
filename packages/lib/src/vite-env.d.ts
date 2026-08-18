/// <reference types="vite/client" />
import { AttributeStore } from "./utils/observability/AttributeStore/types";

declare module "@via-ds/icons/styles.css" {}

declare global {
  module "*.svg" {
    const content: string;
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
