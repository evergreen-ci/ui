/// <reference types="vite/client" />

declare module "*.graphql" {
  import { DocumentNode } from "graphql";

  const content: DocumentNode;
  export default content;
}

interface Window {
  newrelic?: {
    addPageAction(name: string, attributes: object);
    setCustomAttribute: (
      name: string,
      value: string | number | boolean | null,
      persist?: boolean,
    ) => void;
  };
}
