import { ConfigurePatchPageTabs, VersionPageTabs } from "types/patch";
import { TaskTab } from "types/task";
import {
  getTaskRoute,
  getVersionRoute,
  getSpawnHostRoute,
  getPatchRoute,
  getTaskHistoryRoute,
  getVariantHistoryRoute,
  getProjectPatchesRoute,
  getWaterfallRoute,
} from "./routes";

const identifierWithSpecialCharacters = "!?identifier@";
const escapedIdentifier = "!%3Fidentifier%40";
const taskIDWithSpecialCharacters = "bazel_run_/@!:/:format";
const escapedTaskID = "bazel_run_%2F%40!%3A%2F%3Aformat";

describe("getProjectPatchesRoute", () => {
  it("escapes special characters projectIdentifier", () => {
    expect(getProjectPatchesRoute(identifierWithSpecialCharacters)).toBe(
      `/project/${escapedIdentifier}/patches`,
    );
  });
});

describe("getTaskRoute", () => {
  it("generates a test route with only an id", () => {
    expect(getTaskRoute("SomeId")).toBe("/task/SomeId");
  });
  it("generates a test route with only an id and a tab", () => {
    expect(getTaskRoute("SomeId", { tab: "logs" as TaskTab })).toBe(
      "/task/SomeId/logs",
    );
  });
  it("generates a test route with only an id and some params", () => {
    expect(getTaskRoute("SomeId", { a: "b" })).toBe("/task/SomeId?a=b");
  });
  it("generates a test route with only an id, tab and some params", () => {
    expect(getTaskRoute("SomeId", { tab: "logs" as TaskTab, a: "b" })).toBe(
      "/task/SomeId/logs?a=b",
    );
  });
});

describe("getVersionRoute", () => {
  it("generates a version route with  the default tab when provided an id", () => {
    expect(getVersionRoute("SomeId")).toBe("/version/SomeId/tasks");
  });
  it("generates a version route with only an id and a tab", () => {
    expect(getVersionRoute("SomeId", { tab: "tasks" as VersionPageTabs })).toBe(
      "/version/SomeId/tasks",
    );
  });
  it("generates a version route with only an id and some params", () => {
    expect(getVersionRoute("SomeId", { variant: "b" })).toBe(
      "/version/SomeId/tasks?variant=b",
    );
  });
  it("generates a version route with only an id, tab and some params", () => {
    expect(
      getVersionRoute("SomeId", {
        tab: "tasks" as VersionPageTabs,
        variant: "b",
      }),
    ).toBe("/version/SomeId/tasks?variant=b");
  });
});

describe("getSpawnHostRoute", () => {
  it("generates a default Spawn host route when provided with no params", () => {
    expect(getSpawnHostRoute({})).toBe("/spawn/host?");
  });
  it("generates a default Spawn host route with filled params when provided", () => {
    expect(
      getSpawnHostRoute({
        distroId: "ubuntu1604",
        taskId: "someTask",
        spawnHost: true,
      }),
    ).toBe("/spawn/host?distroId=ubuntu1604&spawnHost=True&taskId=someTask");
  });
});

describe("getPatchRoute", () => {
  it("generates a link to the version page if it is not provided with a configurable option", () => {
    expect(getPatchRoute("somePatchId", { configure: false })).toBe(
      "/version/somePatchId/tasks",
    );
  });
  it("generates a link to the patch configure page if it is provided with a configurable option", () => {
    expect(getPatchRoute("somePatchId", { configure: true })).toBe(
      "/patch/somePatchId/configure/tasks",
    );
  });
  it("generates a link with a default tab when none is provided", () => {
    expect(getPatchRoute("somePatchId", { configure: true })).toBe(
      "/patch/somePatchId/configure/tasks",
    );
  });
  it("generates a link with a provided tab", () => {
    expect(
      getPatchRoute("somePatchId", {
        configure: true,
        tab: ConfigurePatchPageTabs.Parameters,
      }),
    ).toBe("/patch/somePatchId/configure/parameters");
    expect(
      getPatchRoute("somePatchId", {
        configure: true,
        tab: ConfigurePatchPageTabs.Changes,
      }),
    ).toBe("/patch/somePatchId/configure/changes");
  });
});

describe("getWaterfallRoute", () => {
  it("generates a waterfall page link", () => {
    expect(getWaterfallRoute("someProject")).toBe(
      "/project/someProject/waterfall",
    );
  });
  it("generates a waterfall page link with status filters", () => {
    expect(
      getWaterfallRoute("someProject", {
        statusFilters: ["failed"],
      }),
    ).toBe("/project/someProject/waterfall?statuses=failed");
    expect(
      getWaterfallRoute("someProject", {
        statusFilters: ["failed", "test-timed-out"],
      }),
    ).toBe("/project/someProject/waterfall?statuses=failed,test-timed-out");
  });
  it("generates a waterfall page link with task filters", () => {
    expect(
      getWaterfallRoute("someProject", {
        taskFilters: ["task1"],
      }),
    ).toBe("/project/someProject/waterfall?tasks=task1");
    expect(
      getWaterfallRoute("someProject", {
        taskFilters: ["task1", "task2"],
      }),
    ).toBe("/project/someProject/waterfall?tasks=task1,task2");
  });
  it("generates a waterfall page link with requester filters", () => {
    expect(
      getWaterfallRoute("someProject", {
        requesterFilters: ["git_tag_requester"],
      }),
    ).toBe("/project/someProject/waterfall?requesters=git_tag_requester");
  });
  it("generates a waterfall page link with build variant filters", () => {
    expect(
      getWaterfallRoute("someProject", {
        variantFilters: ["variant1"],
      }),
    ).toBe("/project/someProject/waterfall?buildVariants=variant1");
    expect(
      getWaterfallRoute("someProject", {
        variantFilters: ["variant1", "variant2"],
      }),
    ).toBe("/project/someProject/waterfall?buildVariants=variant1,variant2");
  });
});
describe("getTaskHistoryRoute", () => {
  it("generates a link to the task history page", () => {
    expect(getTaskHistoryRoute("project", "taskName")).toBe(
      "/task-history/project/taskName",
    );
  });
  it("escapes special characters projectIdentifier", () => {
    expect(
      getTaskHistoryRoute(identifierWithSpecialCharacters, "taskName"),
    ).toBe(`/task-history/${escapedIdentifier}/taskName`);
  });
  it("escapes special characters taskId", () => {
    expect(getTaskHistoryRoute("project", taskIDWithSpecialCharacters)).toBe(
      `/task-history/project/${escapedTaskID}`,
    );
  });
  it("generates a link with failing or passing tests", () => {
    expect(
      getTaskHistoryRoute("project", "taskName", {
        filters: {
          failingTests: ["someFailingTest"],
        },
      }),
    ).toBe("/task-history/project/taskName?failed=someFailingTest");
    expect(
      getTaskHistoryRoute("project", "taskName", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
        },
      }),
    ).toBe(
      "/task-history/project/taskName?failed=someFailingTest,someOtherFailingTest",
    );
    expect(
      getTaskHistoryRoute("project", "taskName", {
        filters: {
          passingTests: ["somePassingTests"],
        },
      }),
    ).toBe("/task-history/project/taskName?passed=somePassingTests");
    expect(
      getTaskHistoryRoute("project", "taskName", {
        filters: {
          passingTests: ["somePassingTests", "someOtherPassingTests"],
        },
      }),
    ).toBe(
      "/task-history/project/taskName?passed=somePassingTests,someOtherPassingTests",
    );
  });
  it("generates a link with failing and passing tests", () => {
    expect(
      getTaskHistoryRoute("project", "taskName", {
        filters: {
          failingTests: ["someFailingTest"],
          passingTests: ["somePassingTests"],
        },
      }),
    ).toBe(
      "/task-history/project/taskName?failed=someFailingTest&passed=somePassingTests",
    );
    expect(
      getTaskHistoryRoute("project", "taskName", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
          passingTests: ["somePassingTests", "someOtherPassingTests"],
        },
      }),
    ).toBe(
      "/task-history/project/taskName?failed=someFailingTest,someOtherFailingTest&passed=somePassingTests,someOtherPassingTests",
    );
  });
  it("generates a link with a selectedCommit", () => {
    expect(
      getTaskHistoryRoute("project", "taskName", {
        selectedCommit: 1,
      }),
    ).toBe("/task-history/project/taskName?selectedCommit=1");
  });
  it("generates a link with a selectedCommit and test filters", () => {
    expect(
      getTaskHistoryRoute("project", "taskName", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
        },
        selectedCommit: 1,
      }),
    ).toBe(
      "/task-history/project/taskName?failed=someFailingTest,someOtherFailingTest&selectedCommit=1",
    );
  });
  it("generates a link with a task ID", () => {
    expect(
      getTaskHistoryRoute("project", "taskName", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
        },
        selectedCommit: 1,
        taskId: "12345",
      }),
    ).toBe(
      "/task-history/project/taskName?failed=someFailingTest,someOtherFailingTest&selectedCommit=1&taskId=12345",
    );
  });
});

describe("getVariantHistoryRoute", () => {
  it("generates a link to the variant history page", () => {
    expect(getVariantHistoryRoute("someProject", "someVariantId")).toBe(
      "/variant-history/someProject/someVariantId",
    );
  });
  it("escapes special characters projectIdentifier", () => {
    expect(
      getVariantHistoryRoute(identifierWithSpecialCharacters, "someVariantId"),
    ).toBe(`/variant-history/${escapedIdentifier}/someVariantId`);
  });
  it("generates a link with failing or passing tests", () => {
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          failingTests: ["someFailingTest"],
        },
      }),
    ).toBe("/variant-history/someProject/someVariant?failed=someFailingTest");
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
        },
      }),
    ).toBe(
      "/variant-history/someProject/someVariant?failed=someFailingTest,someOtherFailingTest",
    );
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          passingTests: ["somePassingTests"],
        },
      }),
    ).toBe("/variant-history/someProject/someVariant?passed=somePassingTests");
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          passingTests: ["somePassingTests", "someOtherPassingTests"],
        },
      }),
    ).toBe(
      "/variant-history/someProject/someVariant?passed=somePassingTests,someOtherPassingTests",
    );
  });
  it("generates a link with failing and passing tests", () => {
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          failingTests: ["someFailingTest"],
          passingTests: ["somePassingTests"],
        },
      }),
    ).toBe(
      "/variant-history/someProject/someVariant?failed=someFailingTest&passed=somePassingTests",
    );
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
          passingTests: ["somePassingTests", "someOtherPassingTests"],
        },
      }),
    ).toBe(
      "/variant-history/someProject/someVariant?failed=someFailingTest,someOtherFailingTest&passed=somePassingTests,someOtherPassingTests",
    );
  });
  it("generates a link with a skip query param", () => {
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        selectedCommit: 1,
      }),
    ).toBe("/variant-history/someProject/someVariant?selectedCommit=1");
  });
});
