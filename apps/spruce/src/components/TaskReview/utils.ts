import { gql } from "@apollo/client";
import { cache } from "gql/client/cache";
import { TaskQuery } from "gql/generated/types";

export const updateTask = <
  T extends NonNullable<TaskQuery["task"]>,
  U = Partial<T>,
>(
  task: T,
  updater: (data: U | null) => U | null | void,
) => {
  cache.updateFragment(
    {
      id: cache.identify(task),
      fragment: gql`
        fragment TaskReviewed on Task {
          reviewed
        }
      `,
    },
    updater,
  );
};
