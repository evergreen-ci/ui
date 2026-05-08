import { FieldReadFunction, makeVar } from "@apollo/client";
import { Task } from "gql/generated/types";
import { getItem } from "../db";

export const readTaskReviewed = ((existing, { cache, readField, storage }) => {
  // Look for a saved value in the browser's IndexedDB
  // Using the field's storage object and a reactive variable allows us to get around the "no async reads" rule
  // https://github.com/apollographql/apollo-feature-requests/issues/383#issuecomment-1528063675
  if (!storage.var) {
    storage.var = makeVar(false);

    const taskId = readField<Task["id"]>("id") ?? "";
    const execution = readField<Task["execution"]>("execution") ?? 0;
    getItem([taskId, execution]).then((data) => {
      if (data !== undefined) {
        storage.var(data);
      }
      cache.modify({
        id: cache.identify({
          __typename: "Task",
          id: taskId,
          execution,
        }),
        fields: {
          reviewed() {
            return data ?? false;
          },
        },
        broadcast: false,
      });
    });
  } else if (existing !== undefined) {
    // When cache has a value, keep storage.var in sync asynchronously.
    if (storage.var() !== existing) {
      Promise.resolve().then(() => storage.var(existing));
    }
    // Return cache value immediately for real-time updates.
    return existing;
  }
  return storage.var();
}) satisfies FieldReadFunction<Task["reviewed"]>;
