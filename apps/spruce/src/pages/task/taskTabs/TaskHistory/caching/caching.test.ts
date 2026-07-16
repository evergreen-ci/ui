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
    existingData: undefined,
    extensions: {},
    readField,
  } as FieldMergeFunctionOptions;

  it("merges tasks arrays", () => {
    expect(
      mergeTasks(
        { pagination, tasks: tasks.slice(0, 2) },
        { pagination, tasks: tasks.slice(2) },
        readFn,
      ),
    ).toStrictEqual({
      allTaskOrders: allTaskOrders,
      pagination,
      tasks: tasks,
    });
  });

  it("merges tasks when incoming is newer than existing", () => {
    expect(
      mergeTasks(
        { pagination, tasks: tasks.slice(2) },
        { pagination, tasks: tasks.slice(0, 2) },
        readFn,
      ),
    ).toStrictEqual({
      allTaskOrders: allTaskOrders,
      pagination,
      tasks: tasks,
    });
  });

  it("deduplicates tasks when merging", () => {
    expect(
      mergeTasks(
        { pagination, tasks: tasks.slice(0, 4) },
        { pagination, tasks: tasks.slice(2) },
        readFn,
      ),
    ).toStrictEqual({
      allTaskOrders: allTaskOrders,
      pagination,
      tasks: tasks,
    });
  });

  it("returns an identical cache when duplicate data is incoming", () => {
    expect(
      mergeTasks(
        { pagination, tasks: tasks },
        { pagination, tasks: tasks },
        readFn,
      ),
    ).toStrictEqual({
      allTaskOrders: allTaskOrders,
      pagination,
      tasks: tasks,
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
        cursorParams: {
          cursorId: tasks[0].id,
          direction: TaskHistoryDirection.Before,
          includeCursor: true,
        },
        limit: 6,
      },
    };

    expect(
      readTasks(
        { pagination, tasks: tasks },
        // @ts-expect-error: for tests we can omit unused fields from the args
        { args, readField } as FieldFunctionOptions,
      ),
    ).toStrictEqual({
      pagination,
      tasks: tasks,
    });
  });

  describe("direction is BEFORE", () => {
    it("includes task if includeCursor is true", () => {
      const args = {
        options: {
          cursorParams: {
            cursorId: tasks[0].id,
            direction: TaskHistoryDirection.Before,
            includeCursor: true,
          },
          limit: 3,
        },
      };

      expect(
        readTasks(
          { pagination, tasks: tasks },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        pagination,
        tasks: tasks.slice(0, 4),
      });
    });

    it("excludes task if includeCursor is false", () => {
      const args = {
        options: {
          cursorParams: {
            cursorId: tasks[0].id,
            direction: TaskHistoryDirection.Before,
            includeCursor: false,
          },
          limit: 2,
        },
      };

      expect(
        readTasks(
          { pagination, tasks: tasks },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        pagination,
        tasks: tasks.slice(1, 4),
      });
    });

    it("returns less than LIMIT activated tasks if task with oldestTaskOrder has already been fetched", () => {
      const args = {
        options: {
          cursorParams: {
            cursorId: tasks[0].id,
            direction: TaskHistoryDirection.Before,
            includeCursor: true,
          },
          limit: 200,
        },
      };

      expect(
        readTasks(
          { allTaskOrders: allTaskOrders, pagination, tasks: tasks },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        pagination,
        tasks: tasks,
      });
    });
  });

  describe("direction is AFTER", () => {
    it("includes task if includeCursor is true", () => {
      const args = {
        options: {
          cursorParams: {
            cursorId: tasks[tasks.length - 1].id,
            direction: TaskHistoryDirection.After,
            includeCursor: true,
          },
          limit: 3,
        },
      };

      expect(
        readTasks(
          { pagination, tasks: tasks },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        pagination,
        tasks: tasks.slice(5),
      });
    });

    it("excludes task if includeCursor is false", () => {
      const args = {
        options: {
          cursorParams: {
            cursorId: tasks[tasks.length - 1].id,
            direction: TaskHistoryDirection.After,
            includeCursor: false,
          },
          limit: 2,
        },
      };

      expect(
        readTasks(
          { pagination, tasks: tasks },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        pagination,
        tasks: tasks.slice(5, 10),
      });
    });

    it("returns less than LIMIT activated tasks if task with mostRecentTaskOrder has already been fetched", () => {
      const args = {
        options: {
          cursorParams: {
            cursorId: tasks[tasks.length - 1].id,
            direction: TaskHistoryDirection.After,
            includeCursor: true,
          },
          limit: 200,
        },
      };

      expect(
        readTasks(
          { allTaskOrders: allTaskOrders, pagination, tasks: tasks },
          // @ts-expect-error: for tests we can omit unused fields from the args
          { args, readField } as FieldFunctionOptions,
        ),
      ).toStrictEqual({
        pagination,
        tasks: tasks,
      });
    });
  });

  it("returns undefined when task is not found in cache", () => {
    const args = {
      options: {
        cursorParams: {
          cursorId: "w",
          direction: TaskHistoryDirection.Before,
          includeCursor: false,
        },
        limit: 2,
      },
    };

    expect(
      readTasks(
        { pagination, tasks: tasks },
        // @ts-expect-error: for tests we can omit unused fields from the args
        { args, readField } as FieldFunctionOptions,
      ),
    ).toBeUndefined();
  });

  it("returns undefined when date parameter is supplied", () => {
    const args = {
      options: {
        cursorParams: {
          cursorId: "w",
          date: new Date(),
          direction: TaskHistoryDirection.Before,
          includeCursor: false,
        },
        limit: 2,
      },
    };

    expect(
      readTasks(
        { pagination, tasks: tasks },
        // @ts-expect-error: for tests we can omit unused fields from the args
        { args, readField } as FieldFunctionOptions,
      ),
    ).toBeUndefined();
  });

  it("returns undefined when the number of activated versions found is less than the limit", () => {
    const args = {
      options: {
        cursorParams: {
          cursorId: "w",
          date: new Date(),
          direction: TaskHistoryDirection.Before,
          includeCursor: false,
        },
        limit: 20,
      },
    };

    expect(
      readTasks(
        { pagination, tasks: tasks },
        // @ts-expect-error: for tests we can omit unused fields from the args
        { args, readField } as FieldFunctionOptions,
      ),
    ).toBeUndefined();
  });
});
