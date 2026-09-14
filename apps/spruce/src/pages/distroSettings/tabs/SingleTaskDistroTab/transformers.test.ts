import { gqlToForm } from "./transformers";

const singleTaskDistroData = {
  spruceConfig: {
    singleTaskDistro: {
      projectTasksPairs: [
        {
          projectId: "spruce",
          isRegex: false,
          allowedTasks: ["storybook", "lint"],
          allowedBVs: ["ubuntu1604"],
          displayName: "spruce (Repo)",
        },
        {
          projectId: "mongodb-mongo-v.*",
          isRegex: true,
          allowedTasks: ["test", "compile"],
          allowedBVs: ["windows", "ubuntu1604"],
          displayName: "mongodb-mongo-v.*",
        },
      ],
    },
  },
};

describe("single task distro data", () => {
  it("correctly converts from GQL to a form and sorts projects and allowed tasks alphabetically", () => {
    expect(gqlToForm(singleTaskDistroData)).toStrictEqual({
      projectTasksPairs: [
        {
          displayTitle: "mongodb-mongo-v.*",
          projectId: "mongodb-mongo-v.*",
          isRegex: true,
          allowedTasks: ["compile", "test"],
          allowedBVs: ["ubuntu1604", "windows"],
        },
        {
          displayTitle: "spruce (Repo)",
          projectId: "spruce",
          isRegex: false,
          allowedTasks: ["lint", "storybook"],
          allowedBVs: ["ubuntu1604"],
        },
      ],
    });
  });
});
