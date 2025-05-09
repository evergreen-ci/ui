import { FieldFunctionOptions } from "@apollo/client";
import { TaskHistoryDirection } from "gql/generated/types";
import { tasks } from "../testData";
import { mergeTasks, readTasks } from ".";

// @ts-expect-error: no need to type the args for this mock.
const readField = (field, obj) => obj[field];

const pagination = {
  mostRecentTaskOrder: 100,
  oldestTaskOrder: 1,
};

describe("mergeTasks", () => {
  const readFn = { readField } as FieldFunctionOptions;

  it("merges tasks arrays", () => {
    expect(
      mergeTasks(
        { tasks: tasks.slice(0, 2), pagination },
        { tasks: tasks.slice(2, -1), pagination },
        readFn,
      ),
    ).toStrictEqual({
      tasks: tasks.slice(0, -1),
      pagination,
    });
  });

  it("merges tasks when incoming is newer than existing", () => {
    expect(
      mergeTasks(
        { tasks: tasks.slice(2, -1), pagination },
        { tasks: tasks.slice(0, 2), pagination },
        readFn,
      ),
    ).toStrictEqual({
      tasks: tasks.slice(0, -1),
      pagination,
    });
  });

  it("deduplicates tasks when merging", () => {
    expect(
      mergeTasks(
        { tasks: tasks.slice(0, 4), pagination },
        { tasks: tasks.slice(2), pagination },
        readFn,
      ),
    ).toStrictEqual({
      tasks: tasks,
      pagination,
    });
  });

  it("returns an identical cache when duplicate data is incoming", () => {
    expect(
      mergeTasks(
        { tasks: tasks, pagination },
        { tasks: tasks, pagination },
        readFn,
      ),
    ).toStrictEqual({
      tasks: tasks,
      pagination,
    });
  });
});

describe("readTasks", () => {
  it("returns undefined when the cache is empty", () => {
    expect(
      readTasks(undefined, { readField } as FieldFunctionOptions),
    ).toBeUndefined();
  });

  it("reads the first page and returns limit active tasks", () => {
    const args = {
      options: {
        limit: 6,
        cursorParams: {
          cursorId: tasks[0].id,
          includeCursor: true,
          direction: TaskHistoryDirection.Before,
        },
      },
    };

    expect(
      readTasks(
        { tasks: tasks, pagination },
        // @ts-expect-error: for tests we can omit unused fields from the args
        { args, readField } as FieldFunctionOptions,
      ),
    ).toStrictEqual({
      tasks: tasks,
      pagination,
    });
  });

  describe("direction is BEFORE", () => {
    it("includes task if includeCursor is true", () => {
      const args = {
        options: {
          limit: 3,
          cursorParams: {
            cursorId: tasks[0].id,
            includeCursor: true,
            direction: TaskHistoryDirection.Before,
          },
        },
      };

      expect(
        readTasks(
          { tasks: tasks, pagination },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        tasks: tasks.slice(0, 4),
        pagination,
      });
    });

    it("excludes task if includeCursor is false", () => {
      const args = {
        options: {
          limit: 2,
          cursorParams: {
            cursorId: tasks[0].id,
            includeCursor: false,
            direction: TaskHistoryDirection.Before,
          },
        },
      };

      expect(
        readTasks(
          { tasks: tasks, pagination },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        tasks: tasks.slice(1, 4),
        pagination,
      });
    });
  });

  describe("direction is AFTER", () => {
    it("includes task if includeCursor is true", () => {
      const args = {
        options: {
          limit: 3,
          cursorParams: {
            cursorId: tasks[tasks.length - 1].id,
            includeCursor: true,
            direction: TaskHistoryDirection.After,
          },
        },
      };

      expect(
        readTasks(
          { tasks: tasks, pagination },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        tasks: tasks.slice(5),
        pagination,
      });
    });

    it("excludes task if includeCursor is false", () => {
      const args = {
        options: {
          limit: 2,
          cursorParams: {
            cursorId: tasks[tasks.length - 1].id,
            includeCursor: false,
            direction: TaskHistoryDirection.After,
          },
        },
      };

      expect(
        readTasks(
          { tasks: tasks, pagination },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        tasks: tasks.slice(5, 10),
        pagination,
      });
    });
  });

  it("returns undefined when task is not found in cache", () => {
    const args = {
      options: {
        limit: 2,
        cursorParams: {
          cursorId: "w",
          includeCursor: false,
          direction: TaskHistoryDirection.Before,
        },
      },
    };

    expect(
      readTasks(
        { tasks: tasks, pagination },
        // @ts-expect-error: for tests we can omit unused fields from the args
        { args, readField } as FieldFunctionOptions,
      ),
    ).toBeUndefined();
  });

  it("returns undefined when date parameter is supplied", () => {
    const args = {
      options: {
        limit: 2,
        cursorParams: {
          cursorId: "w",
          includeCursor: false,
          direction: TaskHistoryDirection.Before,
          date: new Date(),
        },
      },
    };

    expect(
      readTasks(
        { tasks: tasks, pagination },
        // @ts-expect-error: for tests we can omit unused fields from the args
        { args, readField } as FieldFunctionOptions,
      ),
    ).toBeUndefined();
  });

  it("returns undefined when the number of activated versions found is less than the limit", () => {
    const args = {
      options: {
        limit: 20,
        cursorParams: {
          cursorId: "w",
          includeCursor: false,
          direction: TaskHistoryDirection.Before,
          date: new Date(),
        },
      },
    };

    expect(
      readTasks(
        { tasks: tasks, pagination },
        // @ts-expect-error: for tests we can omit unused fields from the args
        { args, readField } as FieldFunctionOptions,
      ),
    ).toBeUndefined();
  });
});
