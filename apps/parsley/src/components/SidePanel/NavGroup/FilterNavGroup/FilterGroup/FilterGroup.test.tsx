import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { CaseSensitivity, MatchType } from "constants/enums";
import FilterGroup from ".";

const defaultFilter = {
  caseSensitive: CaseSensitivity.Insensitive,
  expression: "myFilter",
  matchType: MatchType.Exact,
  visible: true,
};

describe("filters", () => {
  it("should display the name of the filter", () => {
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={vi.fn()}
        filter={defaultFilter}
      />,
    );
    expect(screen.getByText(defaultFilter.expression)).toBeInTheDocument();
  });

  it("should be able to toggle editing", async () => {
    const user = userEvent.setup();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={vi.fn()}
        filter={defaultFilter}
      />,
    );
    await user.click(screen.getByLabelText("Edit filter"));
    expect(screen.getByDataCy("edit-filter-name")).toBeInTheDocument();
    expect(screen.getByDataCy("edit-filter-name")).toHaveValue(
      defaultFilter.expression,
    );

    expect(screen.getByDataCy("edit-filter-name")).toHaveFocus();
    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    expect(confirmButton).toBeInTheDocument();
  });

  it("should call editFilter with the correct parameters", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />,
    );
    // Clear the text input and submit a new filter.
    await user.click(screen.getByLabelText("Edit filter"));
    await user.clear(screen.getByDataCy("edit-filter-name"));
    await user.type(screen.getByDataCy("edit-filter-name"), "newFilter");

    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    await user.click(confirmButton);

    expect(editFilter).toHaveBeenCalledTimes(1);
    expect(editFilter).toHaveBeenCalledWith(
      "expression",
      "newFilter",
      defaultFilter,
    );
  });

  it("should prevent the user from submitting an invalid filter", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />,
    );
    // Clear the text input and submit a new filter.
    await user.click(screen.getByLabelText("Edit filter"));
    await user.clear(screen.getByDataCy("edit-filter-name"));
    await user.type(
      screen.getByDataCy("edit-filter-name"),
      "some [[invalid regex",
    );
    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
    await user.clear(screen.getByDataCy("edit-filter-name"));
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
  });

  it("should toggle between visibility icons when they are clicked", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />,
    );
    expect(screen.getByLabelText("Hide filter")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Hide filter"));
    expect(editFilter).toHaveBeenCalledTimes(1);
    expect(editFilter).toHaveBeenCalledWith("visible", false, defaultFilter);
  });

  it("should call deleteFilter with the correct parameters", async () => {
    const user = userEvent.setup();
    const deleteFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={deleteFilter}
        editFilter={vi.fn()}
        filter={defaultFilter}
      />,
    );
    await user.click(screen.getByLabelText("Delete filter"));
    expect(deleteFilter).toHaveBeenCalledTimes(1);
    expect(deleteFilter).toHaveBeenCalledWith("myFilter");
  });

  it("should be able to interact with Case Sensitivity segmented control", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />,
    );

    const insensitiveOption = screen.getByRole("tab", {
      name: "Insensitive",
    });
    const sensitiveOption = screen.getByRole("tab", {
      name: "Sensitive",
    });

    expect(insensitiveOption).toHaveAttribute("aria-selected", "true");
    expect(sensitiveOption).toHaveAttribute("aria-selected", "false");

    await user.click(sensitiveOption);

    expect(insensitiveOption).toHaveAttribute("aria-selected", "false");
    expect(sensitiveOption).toHaveAttribute("aria-selected", "true");

    expect(editFilter).toHaveBeenCalledWith(
      "caseSensitive",
      CaseSensitivity.Sensitive,
      defaultFilter,
    );
  });

  it("should be able to interact with Match Type segmented control", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />,
    );

    const exactOption = screen.getByRole("tab", {
      name: "Exact",
    });
    const inverseOption = screen.getByRole("tab", {
      name: "Inverse",
    });

    expect(exactOption).toHaveAttribute("aria-selected", "true");
    expect(inverseOption).toHaveAttribute("aria-selected", "false");

    await user.click(inverseOption);

    expect(exactOption).toHaveAttribute("aria-selected", "false");
    expect(inverseOption).toHaveAttribute("aria-selected", "true");

    expect(editFilter).toHaveBeenCalledWith(
      "matchType",
      MatchType.Inverse,
      defaultFilter,
    );
  });

  it("should display an error message when the provided filter regular expression is invalid", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={{ ...defaultFilter, expression: "invalid (regex" }}
      />,
    );
    expect(screen.getByDataCy("validation-error-icon")).toBeInTheDocument();
    await user.hover(screen.getByDataCy("validation-error-icon"));
    await expect(
      screen.findByText("Invalid Regular Expression: Unterminated group"),
    ).resolves.toBeInTheDocument();
  });
  it("should disable all inputs except editing or deleting for an invalid filter regular expression", async () => {
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={{ ...defaultFilter, expression: "invalid (regex" }}
      />,
    );
    expect(screen.getByLabelText("Hide filter")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("should allow reenabling a invalid filter after it has been fixed", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={{ ...defaultFilter, expression: "invalid (regex" }}
      />,
    );
    await user.click(screen.getByLabelText("Edit filter"));
    expect(
      screen.getByText("Invalid Regular Expression: Unterminated group"),
    ).toBeInTheDocument();
    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
    await user.clear(screen.getByDataCy("edit-filter-name"));
    await user.type(screen.getByDataCy("edit-filter-name"), "newFilter");
    expect(
      screen.queryByText("Invalid Regular Expression: Unterminated group"),
    ).not.toBeInTheDocument();
    expect(confirmButton).toHaveAttribute("aria-disabled", "false");
  });
  it("should reset the component state when the user cancels editing", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />,
    );
    await user.click(screen.getByLabelText("Edit filter"));
    expect(screen.getByDataCy("edit-filter-name")).toHaveValue(
      defaultFilter.expression,
    );
    await user.clear(screen.getByDataCy("edit-filter-name"));
    expect(screen.getByText("Filter cannot be empty")).toBeInTheDocument();
    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });
    await user.click(cancelButton);
    expect(screen.getByText(defaultFilter.expression)).toBeInTheDocument();
    expect(screen.queryByDataCy("edit-filter-name")).toBeNull();
    expect(screen.queryByText("Filter cannot be empty")).toBeNull();
  });
  it("if the filter group is collapsed, editing should expand it", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />,
    );
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await user.click(screen.getByLabelText("Edit filter"));

    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
  it("if the user is editing a filter and collapses the group, the edit should be cancelled", async () => {
    const user = userEvent.setup();
    const editFilter = vi.fn();
    render(
      <FilterGroup
        deleteFilter={vi.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />,
    );
    await user.click(screen.getByLabelText("Edit filter"));
    expect(screen.getByDataCy("edit-filter-name")).toBeInTheDocument();
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.queryByDataCy("edit-filter-name")).toBeNull();
  });
});
