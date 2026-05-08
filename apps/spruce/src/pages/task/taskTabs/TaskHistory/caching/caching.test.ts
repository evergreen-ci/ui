import { FieldFunctionOptions } from "@apollo/client";
import { FieldMergeFunctionOptions } from "@apollo/client/cache";
import { TaskHistoryDirection } from "gql/generated/types";
import { tasks } from "../testData";
import { mergeTasks, readTasks } from ".";

// @ts-expect-error: no need to type the args for this mock.
const readField = (field, obj) => obj[field];

const allTaskOrders = new Set<number>();
tasks.forEach((t) => {
  allTaskOrders.add(t.order);
});

const pagination = {
  mostRecentTaskOrder: tasks[0].order,
  oldestTaskOrder: tasks[tasks.length - 1].order,
};

describe("mergeTasks", () => {
  const readFn = {
    readField,
    extensions: {},
    existingData: undefined,
  } as FieldMergeFunctionOptions;

  it("merges tasks arrays", () => {
    expect(
      mergeTasks(
        { tasks: tasks.slice(0, 2), pagination },
        { tasks: tasks.slice(2), pagination },
        readFn,
      ),
    ).toStrictEqual({
      tasks: tasks,
      pagination,
      allTaskOrders: allTaskOrders,
    });
  });

  it("merges tasks when incoming is newer than existing", () => {
    expect(
      mergeTasks(
        { tasks: tasks.slice(2), pagination },
        { tasks: tasks.slice(0, 2), pagination },
        readFn,
      ),
    ).toStrictEqual({
      tasks: tasks,
      pagination,
      allTaskOrders: allTaskOrders,
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
      allTaskOrders: allTaskOrders,
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
      allTaskOrders: allTaskOrders,
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

    it("returns less than LIMIT activated tasks if task with oldestTaskOrder has already been fetched", () => {
      const args = {
        options: {
          limit: 200,
          cursorParams: {
            cursorId: tasks[0].id,
            includeCursor: true,
            direction: TaskHistoryDirection.Before,
          },
        },
      };

      expect(
        readTasks(
          { tasks: tasks, pagination, allTaskOrders: allTaskOrders },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        tasks: tasks,
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

    it("returns less than LIMIT activated tasks if task with mostRecentTaskOrder has already been fetched", () => {
      const args = {
        options: {
          limit: 200,
          cursorParams: {
            cursorId: tasks[tasks.length - 1].id,
            includeCursor: true,
            direction: TaskHistoryDirection.After,
          },
        },
      };

      expect(
        readTasks(
          { tasks: tasks, pagination, allTaskOrders: allTaskOrders },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        tasks: tasks,
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
