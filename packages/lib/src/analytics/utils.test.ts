import { addNewRelicPageAction } from "./utils";

describe("addNewRelicPageAction", () => {
  const originalConsoleDebug = console.debug;
  const mockNewRelic = {
    addPageAction: vi.fn(),
  } as any;

  beforeEach(() => {
    window.newrelic = mockNewRelic;
    console.debug = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    console.debug = originalConsoleDebug;
  });

  it("should send the correct action to newrelic.addPageAction when newrelic is available", () => {
    const action = {
      name: "Clicked TestAction",
      additionalProp: "additionalValue",
    } as const;
    const properties = { prop1: "value1", prop2: "value2" };

    addNewRelicPageAction(action, properties);

    expect(mockNewRelic.addPageAction).toHaveBeenCalledWith(
      "Clicked TestAction",
      {
        prop1: "value1",
        prop2: "value2",
        additionalProp: "additionalValue",
      },
    );
  });

  it("should log the event to the console when newrelic is not available", () => {
    delete window.newrelic;

    const action = {
      name: "Clicked TestAction",
      additionalProp: "additionalValue",
    } as const;
    const properties = { prop1: "value1", prop2: "value2" };

    addNewRelicPageAction(action, properties);

    expect(console.debug).toHaveBeenCalledWith("ANALYTICS EVENT ", {
      name: "Clicked TestAction",
      attributesToSend: {
        prop1: "value1",
        prop2: "value2",
        additionalProp: "additionalValue",
      },
    });
  });

  it("should handle actions with no additional properties", () => {
    const action = { name: "Clicked TestAction" } as const;
    const properties = { prop1: "value1" };

    addNewRelicPageAction(action, properties);

    expect(mockNewRelic.addPageAction).toHaveBeenCalledWith(
      "Clicked TestAction",
      {
        prop1: "value1",
      },
    );
  });
});
