import { InMemoryCache } from "@apollo/client";
import { IMAGE_EVENT_LIMIT } from "pages/image/useEvents";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        distroEvents: {
          keyArgs: ["$distroId"],
        },
        // image: {
        //   keyArgs: ["$id", "$page"],
        // },
        projectEvents: {
          keyArgs: ["$identifier"],
        },
        repoEvents: {
          keyArgs: ["$id"],
        },
        hasVersion: {
          keyArgs: ["$patchId"],
        },
      },
    },
    GeneralSubscription: {
      keyFields: false,
    },
    DistroEventsPayload: {
      fields: {
        count: {
          merge(existing = 0, incoming = 0) {
            return existing + incoming;
          },
        },
        eventLogEntries: {
          merge(existing = [], incoming = []) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Image: {
      keyFields: [],
      fields: {
        events: {
          merge(existing, incoming, { args }) {
            // merge(existing, incoming, { mergeObjects }) {
            //   console.log(existing);
            //   console.log(incoming);
            //   console.log(mergeObjects(existing, incoming));
            //   return mergeObjects(existing, incoming);
            console.log("existing");
            console.log(existing);
            const {
              count: existingCount = 0,
              eventLogEntries: existingEntries = [],
            } = existing || {};
            console.log("incoming");
            console.log(incoming);
            const { count: incomingCount, eventLogEntries: incomingEntries } =
              incoming;
            const count = existingCount + incomingCount;
            const page = args?.page ?? 0;
            console.log("page");
            console.log(page);
            const merged = existingEntries ? existingEntries.slice(0) : [];
            for (let i = 0; i < incomingEntries.length; ++i) {
              merged[page * IMAGE_EVENT_LIMIT + i] = incomingEntries[i];
            }
            console.log("eventLogEntries");
            console.log(merged);
            return {
              count,
              eventLogEntries: merged,
            };
          },
        },
      },
      // ImageEventsPayload: {
      //   fields: {
      //     events: {
      //       merge(existing = { count: 0, eventLogEntries: [] }, incoming, { args })) {

      //       }
      //     },
      //   count: {
      //     merge(existing = 0, incoming = 0) {
      //       console.log("existing");
      //       console.log(existing);
      //       console.log("incoming");
      //       console.log(incoming);
      //       console.log("count");
      //       console.log(existing + incoming);
      //       return existing + incoming;
      //     },
      //   },
      //   eventLogEntries: {
      //     merge(existing: any[], incoming: any[], { args }) {
      //       console.log("existing");
      //       console.log(existing);
      //       console.log("incoming");
      //       console.log(incoming);
      //       let page = 0;
      //       if (args) {
      //         page = args.page;
      //       }
      //       const merged = existing ? existing.slice(0) : [];
      //       for (let i = 0; i < incoming.length; ++i) {
      //         merged[page * IMAGE_EVENT_LIMIT + i] = incoming[i];
      //       }
      //       console.log("merged");
      //       console.log(merged);
      //       return merged;
      //     },
      //   },
      // },
    },
    ProjectEvents: {
      fields: {
        count: {
          merge(existing = 0, incoming = 0) {
            return existing + incoming;
          },
        },
        eventLogEntries: {
          merge(existing = [], incoming = []) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    ProjectAlias: {
      keyFields: false,
    },
    User: {
      keyFields: ["userId"],
    },
    Task: {
      keyFields: ["execution", "id"],
      fields: {
        annotation: {
          merge(existing, incoming, { mergeObjects }) {
            return mergeObjects(existing, incoming);
          },
        },
        taskLogs: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Patch: {
      fields: {
        time: {
          merge(existing, incoming, { mergeObjects }) {
            return mergeObjects(existing, incoming);
          },
        },
      },
    },
  },
});
