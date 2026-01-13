import {
  MockedProvider,
  renderWithRouterMatch as render,
  userEvent,
  screen,
} from "@evg-ui/lib/test_utils";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { foldedCommitData } from "./testData";
import FoldedCommit from ".";

describe("foldedCommit", () => {
  it("displays the number of inactive commits but not the individual commits on render", () => {
    const data = {
      ...foldedCommitData,
    };
    const onToggleFoldedCommit = vi.fn(({ expanded }) => {
      data.expanded = expanded;
    });

    render(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <FoldedCommit
          data={foldedCommitData}
          index={0}
          numVisibleCols={5}
          onToggleFoldedCommit={onToggleFoldedCommit}
          selected={false}
        />
      </MockedProvider>,
    );
    expect(screen.getByText("Expand 5 inactive")).toBeInTheDocument();
    expect(screen.queryByText("Collapse 5 inactive")).toBeNull();
  });

  it("can be expanded to show all of the commits", async () => {
    const data = {
      ...foldedCommitData,
    };
    const onToggleFoldedCommit = vi.fn(({ expanded }) => {
      data.expanded = expanded;
    });

    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <FoldedCommit
          data={data}
          index={0}
          numVisibleCols={5}
          onToggleFoldedCommit={onToggleFoldedCommit}
          selected={false}
        />
      </MockedProvider>,
    );
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByText("Expand 5 inactive"));
    expect(screen.queryByText("Expand 5 inactive")).toBeNull();
    expect(screen.getByText("Collapse 5 inactive")).toBeInTheDocument();
    expect(onToggleFoldedCommit).toHaveBeenCalledWith({
      expanded: true,
      index: 0,
      numCommits: 5,
    });

    const foldedCommits = screen.queryAllByDataCy("folded-commit");
    for (let i = 0; i < foldedCommitData.rolledUpCommits.length; i++) {
      const commit = foldedCommitData.rolledUpCommits[i];
      expect(foldedCommits[i]).toHaveTextContent(commit.message);
    }
  });
});
