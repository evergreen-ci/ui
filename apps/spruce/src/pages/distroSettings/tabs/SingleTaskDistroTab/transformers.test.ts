import { gqlToForm } from "./transformers";

const singleTaskDistroData = {
  spruceConfig: {
    singleTaskDistro: {
      projectTasksPairs: [
        {
          projectId: "spruce",
          allowedTasks: ["storybook", "lint"],
          allowedBVs: ["ubuntu1604"],
        },
        {
          projectId: "evergreen",
          allowedTasks: ["test", "compile"],
          allowedBVs: ["windows", "ubuntu1604"],
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
          displayTitle: "evergreen",
          allowedTasks: ["compile", "test"],
          allowedBVs: ["ubuntu1604"],
        },
        {
          displayTitle: "spruce",
          allowedTasks: ["lint", "storybook"],
          allowedBVs: ["ubuntu1604", "windows"],
        },
      ],
    });
  });
});
