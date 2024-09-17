import { render, screen, waitFor } from "@evg-ui/lib/test_utils";
import App from "App";

describe("app", () => {
  it("renders without crashing", async () => {
    expect.hasAssertions();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("LOADING...")).toBeInTheDocument();
    });
  });
});
