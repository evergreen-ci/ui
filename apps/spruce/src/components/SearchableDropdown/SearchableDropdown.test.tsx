import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import SearchableDropdown from ".";

const RenderSearchableDropdown = (
  props: Omit<React.ComponentProps<typeof SearchableDropdown>, "label">,
) => (
  <SearchableDropdown
    label="Just a test"
    searchPlaceholder="Search"
    {...props}
  />
);

describe("searchableDropdown", () => {
  const originalResizeObserver = window.ResizeObserver;

  beforeEach(() => {
    const mockResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    window.ResizeObserver = mockResizeObserver;
  });

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  it("sets the label to what ever the current value is", () => {
    render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange: vi.fn(),
        options: ["evergreen", "spruce"],
      }),
    );
    expect(screen.getByText("evergreen")).toBeInTheDocument();
  });

  it("should toggle dropdown when clicking on it", async () => {
    const user = userEvent.setup();
    render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange: vi.fn(),
        options: ["evergreen", "spruce"],
      }),
    );
    expect(
      screen.queryByDataCy("searchable-dropdown-options"),
    ).not.toBeInTheDocument();
    await user.click(screen.getByDataCy("searchable-dropdown"));
    expect(
      screen.getByDataCy("searchable-dropdown-options"),
    ).toBeInTheDocument();
    await user.click(screen.getByDataCy("searchable-dropdown"));
    await waitFor(() => {
      expect(
        screen.queryByDataCy("searchable-dropdown-options"),
      ).not.toBeInTheDocument();
    });
  });

  it("should narrow down search results when filtering", async () => {
    const user = userEvent.setup();
    render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange: vi.fn(),
        options: ["evergreen", "spruce"],
      }),
    );
    expect(
      screen.queryByDataCy("searchable-dropdown-options"),
    ).not.toBeInTheDocument();
    await user.click(screen.getByDataCy("searchable-dropdown"));
    expect(
      screen.getByDataCy("searchable-dropdown-options"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      2,
    );
    await user.type(screen.getByPlaceholderText("Search"), "spru");
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      1,
    );
  });

  it("should reset the search input and options after SearchableDropdown closes", async () => {
    const user = userEvent.setup();
    render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange: vi.fn(),
        options: ["evergreen", "spruce"],
      }),
    );
    // use text input to filter and click on document body (which closes the dropdown).
    await user.click(screen.getByDataCy("searchable-dropdown"));
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      2,
    );
    await user.type(screen.getByPlaceholderText("Search"), "spru");
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      1,
    );
    await user.click(screen.getByText("spruce"));

    // when reopening the dropdown, the text input should be cleared and all options should be visible.
    await user.click(screen.getByDataCy("searchable-dropdown"));
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      2,
    );
    expect(screen.getByPlaceholderText("Search")).toHaveValue("");
  });

  it("should use custom search function when passed in", async () => {
    const user = userEvent.setup();
    const searchFunc = vi.fn((options, match) =>
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      options.filter((o) => o === match),
    );
    render(
      RenderSearchableDropdown({
        value: ["evergreen"],
        onChange: vi.fn(),
        options: ["evergreen", "spruce"],
        searchFunc,
      }),
    );
    await user.click(screen.getByDataCy("searchable-dropdown"));

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText("Search"), "spruce");
    expect(searchFunc).toHaveBeenLastCalledWith(
      ["evergreen", "spruce"],
      "spruce",
    );
    expect(screen.getByText("spruce")).toBeInTheDocument();
  });

  describe("when multiselect == false", () => {
    it("should call onChange when clicking on an option and should close the option list", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { rerender } = render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange,
          options: ["evergreen", "spruce"],
        }),
      );
      expect(
        screen.queryByDataCy("searchable-dropdown-options"),
      ).not.toBeInTheDocument();
      await user.click(screen.getByDataCy("searchable-dropdown"));
      expect(
        screen.getByDataCy("searchable-dropdown-options"),
      ).toBeInTheDocument();
      await user.click(screen.getByText("spruce"));
      expect(onChange).toHaveBeenCalledWith("spruce");
      await waitFor(() => {
        expect(
          screen.queryByDataCy("searchable-dropdown-options"),
        ).not.toBeInTheDocument();
      });

      rerender(
        RenderSearchableDropdown({
          value: "spruce",
          onChange,
          options: ["evergreen", "spruce"],
        }),
      );
      expect(screen.getByText("spruce")).toBeInTheDocument();
    });

    it("should reset the search input and options after user selects an option", async () => {
      const user = userEvent.setup();
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange: vi.fn(),
          options: ["evergreen", "spruce"],
        }),
      );
      // use text input to filter and select an option.
      await user.click(screen.getByDataCy("searchable-dropdown"));
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option"),
      ).toHaveLength(2);
      await user.type(screen.getByPlaceholderText("Search"), "spru");
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option"),
      ).toHaveLength(1);
      await user.click(screen.getByText("spruce"));

      // when reopening the dropdown, the text input should be cleared and all options should be visible.
      await user.click(screen.getByDataCy("searchable-dropdown"));
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option"),
      ).toHaveLength(2);
      expect(screen.getByPlaceholderText("Search")).toHaveValue("");
    });

    it("does not show checkmark next to the selected option", async () => {
      const user = userEvent.setup();
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange: vi.fn(),
          options: ["evergreen", "spruce"],
        }),
      );
      await user.click(screen.getByDataCy("searchable-dropdown"));
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option"),
      ).toHaveLength(2);
      expect(screen.queryByDataCy("checkmark")).toBeNull();
    });
  });

  describe("when multiselect == true", () => {
    it("should call onChange when clicking on multiple options and shouldn't close the dropdown", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { rerender } = render(
        RenderSearchableDropdown({
          value: [],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        }),
      );
      expect(
        screen.queryByDataCy("searchable-dropdown-options"),
      ).not.toBeInTheDocument();
      await user.click(screen.getByDataCy("searchable-dropdown"));
      expect(
        screen.getByDataCy("searchable-dropdown-options"),
      ).toBeInTheDocument();
      await user.click(screen.getByText("spruce"));
      expect(onChange).toHaveBeenCalledWith(["spruce"]);

      rerender(
        RenderSearchableDropdown({
          value: ["spruce"],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        }),
      );
      expect(
        screen.getByDataCy("searchable-dropdown-options"),
      ).toBeInTheDocument();

      rerender(
        RenderSearchableDropdown({
          value: ["spruce"],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        }),
      );
      await user.click(screen.getByText("evergreen"));
      expect(onChange).toHaveBeenCalledWith(["spruce", "evergreen"]);
    });

    it("should NOT reset the search input and options after user selects an option", async () => {
      const user = userEvent.setup();
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange: vi.fn(),
          options: ["evergreen", "spruce", "sandbox"],
          allowMultiSelect: true,
        }),
      );
      // use text input to filter and select an option.
      await user.click(screen.getByDataCy("searchable-dropdown"));
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option"),
      ).toHaveLength(3);
      await user.type(screen.getByPlaceholderText("Search"), "s");
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option"),
      ).toHaveLength(2);
      await user.click(screen.getByText("spruce"));

      expect(screen.getByPlaceholderText("Search")).toHaveValue("s");
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option"),
      ).toHaveLength(2);
    });

    it("shows checkmark next to the selected option", async () => {
      const user = userEvent.setup();
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange: vi.fn(),
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        }),
      );
      await user.click(screen.getByDataCy("searchable-dropdown"));
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option"),
      ).toHaveLength(2);
      expect(screen.queryAllByDataCy("checkmark")).toHaveLength(2);
    });
  });

  describe("when using custom render options", () => {
    it("should render custom options", async () => {
      const user = userEvent.setup();
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange: vi.fn(),
          options: [
            {
              label: "Evergreen",
              value: "evergreen",
            },
            {
              label: "Spruce",
              value: "spruce",
            },
          ],
          optionRenderer: (option: any, onClick) => (
            <button
              key={option.value}
              onClick={() => onClick(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ),
        }),
      );
      await user.click(screen.getByDataCy("searchable-dropdown"));
      expect(screen.getByText("Evergreen")).toBeInTheDocument();
      expect(screen.getByText("Spruce")).toBeInTheDocument();
      expect(screen.queryByText("Evergreen")).toBeInstanceOf(HTMLButtonElement);
      expect(screen.queryByText("Spruce")).toBeInstanceOf(HTMLButtonElement);
    });

    it("should be able to click on custom elements", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange,
          options: [
            {
              label: "Evergreen",
              value: "evergreen",
            },
            {
              label: "Spruce",
              value: "spruce",
            },
          ],
          optionRenderer: (option: any, onClick) => (
            <button
              key={option.value}
              onClick={() => onClick(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ),
        }),
      );
      await user.click(screen.getByDataCy("searchable-dropdown"));

      expect(screen.getByText("Spruce")).toBeInTheDocument();
      await user.click(screen.getByText("Spruce"));
      expect(onChange).toHaveBeenCalledWith("spruce");
    });

    it("should render a custom button", () => {
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange: vi.fn(),
          options: ["evergreen", "spruce"],
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          buttonRenderer: (option: string) => (
            <b className="just-a-test">{option}</b>
          ),
        }),
      );
      expect(screen.getByText("evergreen")).toBeInTheDocument();
      expect(screen.queryByText("evergreen")).toHaveAttribute(
        "class",
        "just-a-test",
      );
    });
  });
});
