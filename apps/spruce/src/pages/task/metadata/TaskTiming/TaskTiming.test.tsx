import { MockedProvider } from "@apollo/client/testing";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { getUserMock } from "gql/mocks/getUser";
import { TaskTimingMetadata } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

describe("task timing metadata", () => {
  it.each([
    { link: "Activated → Finish", expected: "total_time_min" },
    { link: "Activated → Start", expected: "wait_time_min" },
    { link: "Start → Finish", expected: "duration_min" },
  ])("queries the correct column for $link", ({ expected, link }) => {
    render(
      <TaskTimingMetadata
        buildVariant="foo"
        projectIdentifier="evg-ui"
        taskName="bar"
      />,
      { wrapper },
    );
    expect(screen.getByRole("link", { name: link })).toHaveAttribute(
      "href",
      expect.stringContaining(expected),
    );
    expect(screen.getByRole("link", { name: link })).toHaveAttribute(
      "href",
      expect.stringContaining("evg-ui"),
    );
    expect(screen.getByRole("link", { name: link })).toHaveAttribute(
      "href",
      expect.stringContaining("foo"),
    );
    expect(screen.getByRole("link", { name: link })).toHaveAttribute(
      "href",
      expect.stringContaining("bar"),
    );
  });

  describe("config", () => {
    afterEach(() => {
      localStorage.clear();
    });

    it.each([
      { label: "Only include successful runs", expected: "success" },
      { label: "Only include waterfall commits", expected: "gitter_request" },
    ])(
      "updates links to include the config parameter $expected",
      async ({ expected, label }) => {
        const user = userEvent.setup();
        render(
          <TaskTimingMetadata
            buildVariant="foo"
            projectIdentifier="evg-ui"
            taskName="bar"
          />,
          { wrapper },
        );

        screen.getAllByRole("link").forEach((l) => {
          expect(l).toHaveAttribute(
            "href",
            expect.not.stringContaining(expected),
          );
        });
        await user.click(screen.getByRole("button", { name: "Config" }));
        expect(screen.getByLabelText(label)).not.toBeChecked();
        await user.click(screen.getByText(label));
        expect(screen.getByLabelText(label)).toBeChecked();
        await user.click(document.body);
        expect(screen.getByLabelText(label)).not.toBeVisible();

        expect(screen.getAllByRole("link")).toHaveLength(3);
        screen.getAllByRole("link").forEach((l) => {
          expect(l).toHaveAttribute("href", expect.stringContaining(expected));
        });
      },
    );

    it("preserves config via localStorage across projects", async () => {
      const user = userEvent.setup();
      const { unmount } = render(
        <TaskTimingMetadata
          buildVariant="foo"
          projectIdentifier="evg-ui"
          taskName="bar"
        />,
        { wrapper },
      );

      await user.click(screen.getByRole("button", { name: "Config" }));
      expect(
        screen.getByLabelText("Only include successful runs"),
      ).not.toBeChecked();
      await user.click(screen.getByText("Only include successful runs"));
      expect(
        screen.getByLabelText("Only include successful runs"),
      ).toBeChecked();
      unmount();

      const { unmount: unmountBaz } = render(
        <TaskTimingMetadata
          buildVariant="fuzz"
          projectIdentifier="different-project"
          taskName="baz"
        />,
        { wrapper },
      );
      await user.click(screen.getByRole("button", { name: "Config" }));
      expect(
        screen.getByLabelText("Only include successful runs"),
      ).toBeChecked();
      await user.click(screen.getByText("Only include waterfall commits"));
      unmountBaz();

      render(
        <TaskTimingMetadata
          buildVariant="fuzzer"
          projectIdentifier="different-project-2"
          taskName="buzz"
        />,
        { wrapper },
      );
      await user.click(screen.getByRole("button", { name: "Config" }));
      expect(
        screen.getByLabelText("Only include successful runs"),
      ).toBeChecked();
      expect(
        screen.getByLabelText("Only include waterfall commits"),
      ).toBeChecked();
    });
  });
});
