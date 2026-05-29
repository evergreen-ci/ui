import { gqlToForm } from "./transformers";

const singleTaskDistroData = {
  spruceConfig: {
    singleTaskDistro: {
      projectTasksPairs: [
        {
          projectId: "spruce",
          allowedTasks: ["storybook", "lint"],
          allowedBVs: ["ubuntu1604"],
          displayName: "spruce (Repo)",
        },
        {
          projectId: "evergreen",
          allowedTasks: ["test", "compile"],
          allowedBVs: ["windows", "ubuntu1604"],
          displayName: "evergreen (Project)",
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
          displayTitle: "evergreen (Project)",
          projectId: "evergreen",
          allowedTasks: ["compile", "test"],
          allowedBVs: ["ubuntu1604", "windows"],
        },
        {
          displayTitle: "spruce (Repo)",
          projectId: "spruce",
          allowedTasks: ["lint", "storybook"],
          allowedBVs: ["ubuntu1604"],
        },
      ],
    });
  });
});
