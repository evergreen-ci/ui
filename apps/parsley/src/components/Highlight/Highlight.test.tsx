import { render, screen } from "@evg-ui/lib/test_utils";
import Highlight from ".";

describe("Highlight", () => {
  it("rejects colors outside of the application palette", () => {
    render(
      <>
        <Highlight data-testid="default-highlight">default</Highlight>
        <Highlight
          color="red;}body{background-image:url(https://example.com)"
          data-testid="unsafe-highlight"
        >
          unsafe
        </Highlight>
      </>,
    );

    expect(screen.getByTestId("unsafe-highlight").className).toBe(
      screen.getByTestId("default-highlight").className,
    );
  });
});
