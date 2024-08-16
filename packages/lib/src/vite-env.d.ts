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
