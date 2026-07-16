import { gqlToForm } from "./transformers";

const singleTaskDistroData = {
  spruceConfig: {
    singleTaskDistro: {
      projectTasksPairs: [
        {
          allowedBVs: ["ubuntu1604"],
          allowedTasks: ["storybook", "lint"],
          displayName: "spruce (Repo)",
          projectId: "spruce",
        },
        {
          allowedBVs: ["windows", "ubuntu1604"],
          allowedTasks: ["test", "compile"],
          displayName: "evergreen (Project)",
          projectId: "evergreen",
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
          allowedBVs: ["ubuntu1604", "windows"],
          allowedTasks: ["compile", "test"],
          displayTitle: "evergreen (Project)",
          projectId: "evergreen",
        },
        {
          allowedBVs: ["ubuntu1604"],
          allowedTasks: ["lint", "storybook"],
          displayTitle: "spruce (Repo)",
          projectId: "spruce",
        },
      ],
    });
  });
});
