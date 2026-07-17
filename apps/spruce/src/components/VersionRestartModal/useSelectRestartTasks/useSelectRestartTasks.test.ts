import { act, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { useSelectRestartTasks } from ".";

describe("useSelectRestartTasks", () => {
  it("should have no tasks selected by default", () => {
    const { result } = renderHook(() => useSelectRestartTasks(version));
    expect(result.current.selectedTasks.size).toEqual(0);
  });

  describe("selectByFilters", () => {
    it("should select all tasks that match the patch status filter when the base status filter is empty", () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      act(() => {
        result.current.selectByFilters({
          baseStatusFilters: [],
          statusFilters: ["success"],
        });
      });
      expect(result.current.selectedTasks.size).toEqual(allTasks.length - 2);
      expect(result.current.selectedTasks).not.toContain(
        "evergreen_ubuntu1604_test_service",
      );
      expect(result.current.selectedTasks).not.toContain(
        "evergreen_ubuntu1604_89",
      );
    });

    it("should select all tasks that match the base status filter when the patch status filter is empty", () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      act(() => {
        result.current.selectByFilters({
          baseStatusFilters: ["success"],
          statusFilters: [],
        });
      });
      expect(result.current.selectedTasks.size).toEqual(1);
      expect(result.current.selectedTasks).toContain(
        "evergreen_ubuntu1604_test_service",
      );
    });

    it("tasks with undefined base statuses do not match with any base status filter state", () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      act(() => {
        result.current.selectByFilters({
          baseStatusFilters: ["success", "fakeStatus", "random"],
          statusFilters: ["success"],
        });
      });
      expect(result.current.selectedTasks.size).toEqual(0);
    });

    it("should select all tasks that match the patch status filter and base status filter when both filters have active filter terms", () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      act(() => {
        result.current.selectByFilters({
          baseStatusFilters: ["success"],
          statusFilters: ["failed"],
        });
      });
      expect(result.current.selectedTasks.size).toEqual(1);
      expect(result.current.selectedTasks).toContain(
        "evergreen_ubuntu1604_test_service",
      );
    });

    it("should deselect all tasks with statuses that do not match any status filter", () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      act(() => {
        result.current.selectByFilters({
          baseStatusFilters: [],
          statusFilters: ["success"],
        });
      });
      expect(result.current.selectedTasks.size).toBeGreaterThan(0);

      act(() => {
        result.current.selectByFilters({
          baseStatusFilters: [],
          statusFilters: [],
        });
      });
      expect(result.current.selectedTasks.size).toEqual(0);
    });

    it("selecting multiple patch statuses should select all tasks with a matching status", () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      act(() => {
        result.current.selectByFilters({
          baseStatusFilters: [],
          statusFilters: ["success", "failed"],
        });
      });
      expect(result.current.selectedTasks).not.toContain(
        "evergreen_ubuntu1604_89",
      );
      expect(result.current.selectedTasks.size).toEqual(allTasks.length - 1);
    });
  });

  describe("toggleSelectedTask", () => {
    it("selecting an individual task should work", () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      act(() => {
        result.current.toggleSelectedTask(
          ["evergreen_lint_generate_lint"],
          false,
        );
      });
      expect(result.current.selectedTasks.size).toEqual(1);
      expect(result.current.selectedTasks).toContain(
        "evergreen_lint_generate_lint",
      );
    });

    it("deselecting an individual task should work if it was selected by valid statuses", async () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      act(() => {
        result.current.selectByFilters({
          baseStatusFilters: [],
          statusFilters: ["success"],
        });
      });
      await waitFor(() => {
        expect(result.current.selectedTasks).toContain(
          "evergreen_lint_generate_lint",
        );
      });

      act(() => {
        result.current.toggleSelectedTask(
          ["evergreen_lint_generate_lint"],
          false,
        );
      });
      expect(result.current.selectedTasks).not.toContain(
        "evergreen_lint_generate_lint",
      );
    });

    it("batch toggling tasks will check all / uncheck all items", () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      act(() => {
        result.current.toggleSelectedTask(allTasks, true);
      });
      expect(result.current.selectedTasks.size).toEqual(allTasks.length);

      act(() => {
        result.current.toggleSelectedTask(allTasks, true);
      });
      expect(result.current.selectedTasks.size).toEqual(0);
    });

    it("batch toggling tasks will set them all to checked when some and not all are originally checked", () => {
      const { result } = renderHook(() => useSelectRestartTasks(version));
      expect(result.current.selectedTasks.size).toEqual(0);

      act(() =>
        result.current.toggleSelectedTask(
          ["evergreen_lint_generate_lint"],
          false,
        ),
      );
      expect(result.current.selectedTasks.size).toEqual(1);

      act(() => result.current.toggleSelectedTask(allTasks, true));
      expect(result.current.selectedTasks.size).toEqual(allTasks.length);
    });
  });
});

const groupedBuildVariants = [
  {
    displayName: "Lint",
    tasks: [
      {
        displayName: "generate-lint",
        displayStatus: "success",
        execution: 0,
        id: "evergreen_lint_generate_lint",
      },
      {
        displayName: "lint-service",
        displayStatus: "success",
        execution: 0,
        id: "evergreen_lint_lint_service",
      },
    ],
    variant: "lint",
  },
  {
    displayName: "Ubuntu 16.04",
    tasks: [
      {
        displayName: "js-test",
        displayStatus: "success",
        execution: 0,
        id: "evergreen_ubuntu1604_js_test",
      },
      {
        displayName: "test-model-distro",
        displayStatus: "success",
        execution: 0,
        id: "evergreen_ubuntu1604_test_model_distro",
      },
      {
        displayName: "test-model-event",
        displayStatus: "success",
        execution: 0,
        id: "evergreen_ubuntu1604_test_model_event",
      },
      {
        displayName: "test-model-grid",
        displayStatus: "success",
        execution: 0,
        id: "evergreen_ubuntu1604_test_model_grid",
      },
      {
        displayName: "test-model-host",
        displayStatus: "success",
        execution: 0,
        id: "evergreen_ubuntu1604_test_model_host",
      },
      {
        baseStatus: "success",
        displayName: "test-service",
        displayStatus: "failed",
        execution: 0,
        id: "evergreen_ubuntu1604_test_service",
      },
    ],
    variant: "ubuntu1604",
  },
  {
    displayName: "Variant",
    tasks: [
      {
        displayName: "test-thirdparty",
        displayStatus: "started",
        execution: 0,
        id: "evergreen_ubuntu1604_89",
      },
    ],
    variant: "variant",
  },
];

const version = {
  buildVariants: groupedBuildVariants,
  generatedTaskCounts: [],
  id: "mainVersion",
  projectIdentifier: "projectIdentifier",
};

const allTasks = [
  "evergreen_lint_generate_lint",
  "evergreen_lint_lint_service",
  "evergreen_ubuntu1604_89",
  "evergreen_ubuntu1604_js_test",
  "evergreen_ubuntu1604_test_model_distro",
  "evergreen_ubuntu1604_test_model_event",
  "evergreen_ubuntu1604_test_model_grid",
  "evergreen_ubuntu1604_test_model_host",
  "evergreen_ubuntu1604_test_service",
];
