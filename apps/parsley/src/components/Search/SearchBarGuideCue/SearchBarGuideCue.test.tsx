import {
  render,
  screen,
  stubGetClientRects,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { HAS_SEEN_SEARCHBAR_GUIDE_CUE } from "constants/storageKeys";
import SearchBarGuideCue from ".";

describe("search bar guide cue", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the guide cue if the user has not seen it before", async () => {
    stubGetClientRects();

    render(<SearchBarGuideCue />);
    await waitFor(() => {
      expect(screen.getByDataCy("searchbar-guide-cue")).toBeInTheDocument();
    });
  });

  it("does not show the guide cue if the user has seen it before", () => {
    localStorage.setItem(HAS_SEEN_SEARCHBAR_GUIDE_CUE, "true");
    render(<SearchBarGuideCue />);
    expect(screen.queryByDataCy("searchbar-guide-cue")).toBeNull();
  });
});
