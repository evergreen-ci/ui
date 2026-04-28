import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import ConfigureTasks from ".";

describe("configureTasks", () => {
  describe("tasks and build variants", () => {
    it("should render all tasks from a single build variant", () => {
      const selectedBuildVariants = ["ubuntu2004"];
      const setSelectedBuildVariantTasks = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
          }}
          setSelectedAliases={() => {}}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={0}
        />,
      );
      expect(screen.queryAllByDataCy("task-checkbox")).toHaveLength(2);
      expect(screen.getByText("compile")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
    });
    it("should render all unique tasks from a multiple build variants", () => {
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { e2e: false, lint: false },
          }}
          setSelectedAliases={() => {}}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={0}
        />,
      );
      expect(screen.queryAllByDataCy("task-checkbox")).toHaveLength(4);
      expect(screen.getByText("compile")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
      expect(screen.getByText("e2e")).toBeInTheDocument();
      expect(screen.getByText("lint")).toBeInTheDocument();
    });
    it("should deduplicate tasks from multiple build variants", () => {
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: true, test: true },
            ubuntu1804: { compile: true, lint: true },
          }}
          setSelectedAliases={() => {}}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={3}
        />,
      );
      expect(screen.queryAllByDataCy("task-checkbox")).toHaveLength(3);
      expect(screen.getByText("compile")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
      expect(screen.getByText("lint")).toBeInTheDocument();
    });
    it("should render an indeterminate checkbox if some tasks are selected in one variant but not another", () => {
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: true, lint: false },
          }}
          setSelectedAliases={() => {}}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={1}
        />,
      );
      const checkbox = screen.getByLabelText("compile");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBePartiallyChecked();
    });
    it("selecting a task should call setSelectedBuildVariantTasks with the correct arguments selecting only that task", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004"];
      const setSelectedBuildVariantTasks = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
          }}
          setSelectedAliases={() => {}}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={0}
        />,
      );
      const checkbox = screen.getByLabelText("compile");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
      expect(setSelectedBuildVariantTasks).not.toHaveBeenCalled();
      await user.click(screen.getByText("compile"));
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: true, test: false },
      });
    });
    it("selecting all tasks should call setSelectedBuildVariantTasks with the correct arguments selecting all of the visible tasks in one variant", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004"];
      const setSelectedBuildVariantTasks = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedAliases={() => {}}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={0}
        />,
      );
      const checkbox = screen.getByLabelText(
        "Select all tasks in this variant",
      );
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
      expect(setSelectedBuildVariantTasks).not.toHaveBeenCalled();
      await user.click(screen.getByText("Select all tasks in this variant"));
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: true, test: true },
        ubuntu1804: { compile: false, lint: false },
      });
    });
    it("selecting a deduplicated task should call setSelectedBuildVariantTasks selecting the task in all variants", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedAliases={() => {}}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={0}
        />,
      );
      const checkbox = screen.getByLabelText("compile");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
      expect(setSelectedBuildVariantTasks).not.toHaveBeenCalled();
      await user.click(screen.getByText("compile"));
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: true, test: false },
        ubuntu1804: { compile: true, lint: false },
      });
    });
    it("selecting all tasks should call setSelectedBuildVariantTasks with the correct arguments selecting all of the visible tasks in multiple variants", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedAliases={() => {}}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={0}
        />,
      );
      const checkbox = screen.getByLabelText(
        "Select all tasks in these variants",
      );
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
      expect(setSelectedBuildVariantTasks).not.toHaveBeenCalled();
      await user.type(screen.getByDataCy("task-filter-input"), "^c");
      await user.click(screen.getByText("Select all tasks in view"));
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: true, test: false },
        ubuntu1804: { compile: true, lint: false },
      });
    });
    it("applying a search should filter the tasks", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedAliases={() => {}}
          setSelectedBuildVariantTasks={() => {}}
          totalSelectedTaskCount={0}
        />,
      );
      await user.type(screen.getByDataCy("task-filter-input"), "compile");
      expect(screen.queryAllByDataCy("task-checkbox")).toHaveLength(1);
      const checkbox = screen.getByLabelText("compile");
      expect(checkbox).toBeInTheDocument();
    });
  });
  describe("downstream tasks and aliases", () => {
    it("should render alias variant and tasks if they are selected", () => {
      const selectedBuildVariants = ["parsley"];
      const setSelectedBuildVariantTasks = vi.fn();
      const setSelectedAliases = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: true, lint: false },
          }}
          setSelectedAliases={setSelectedAliases}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={3}
        />,
      );
      expect(screen.getByText("ubuntu2204-large")).toBeInTheDocument();
      const checkbox = screen.getByLabelText("e2e_test");
      expect(checkbox).toBeInTheDocument();
    });
    it("should disable individual task checkboxes for disabled aliases", () => {
      const selectedBuildVariants = ["parsley"];
      const setSelectedBuildVariantTasks = vi.fn();
      const setSelectedAliases = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{}}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: true, lint: false },
          }}
          setSelectedAliases={setSelectedAliases}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={1}
        />,
      );
      expect(screen.getByText("ubuntu2204-large")).toBeInTheDocument();
      const checkbox = screen.getByLabelText("e2e_test");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute("aria-disabled", "true");
    });
    it("should automatically select all tasks for an alias if the alias is selected", () => {
      const selectedBuildVariants = ["parsley"];
      const setSelectedBuildVariantTasks = vi.fn();
      const setSelectedAliases = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={1}
          childPatches={[]}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{ parsley: true }}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: true, lint: false },
          }}
          setSelectedAliases={setSelectedAliases}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={1}
        />,
      );
      expect(screen.getByText("ubuntu2204-large")).toBeInTheDocument();
      const checkbox = screen.getByLabelText("e2e_test");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });
    it("should render both alias name and normal tasks if both are selected", () => {
      const selectedBuildVariants = ["parsley", "ubuntu2004"];
      const setSelectedBuildVariantTasks = vi.fn();
      const setSelectedAliases = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={1}
          childPatches={[]}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{ parsley: true }}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedAliases={setSelectedAliases}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={0}
        />,
      );
      expect(screen.getByLabelText("compile")).toBeInTheDocument();
      expect(screen.getByLabelText("test")).toBeInTheDocument();
      expect(screen.getByLabelText("parsley")).toBeInTheDocument();
    });
    it("selecting the entire alias calls setSelectedAliases with the correct arguments", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["parsley"];
      const setSelectedBuildVariantTasks = vi.fn();
      const setSelectedAliases = vi.fn();
      render(
        <ConfigureTasks
          activated={false}
          aliasCount={0}
          childPatches={[]}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{
            parsley: false,
          }}
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedAliases={setSelectedAliases}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          totalSelectedTaskCount={0}
        />,
      );
      expect(screen.getByLabelText("Add alias to patch")).toBeInTheDocument();
      await user.click(screen.getByText("Add alias to patch"));
      expect(setSelectedAliases).toHaveBeenCalledWith({
        parsley: true,
      });
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: false, test: false },
        ubuntu1804: { compile: false, lint: false },
      });
    });
  });
});
