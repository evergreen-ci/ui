import { render, screen } from "test_utils";
import { HelloWorld } from ".";

describe("helloWorld", () => {
  it("renders hello world text", () => {
    render(<HelloWorld />);
    expect(screen.getByText("Hello, World!")).toBeVisible();
  });

  it("has the correct data-cy attribute", () => {
    render(<HelloWorld />);
    expect(screen.getByDataCy("hello-world")).toBeInTheDocument();
  });
});
