import { gqlToForm } from "./transformers";

const singleTaskDistroData = {
  spruceConfig: {
    singleTaskDistro: {
      projectTasksPairs: [
        {
          projectId: "spruce",
          allowedTasks: ["storybook", "lint"],
        },
        {
          projectId: "evergreen",
          allowedTasks: ["test", "compile"],
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
        },
        {
          displayTitle: "spruce",
          allowedTasks: ["lint", "storybook"],
        },
      ],
    });
  });
});
