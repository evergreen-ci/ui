import { GithubProjectConflicts } from "gql/generated/types";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { GCQFormState } from "./types";

describe("getFormSchema", () => {
  const getSchema = (repoData?: GCQFormState) =>
    getFormSchema(
      "test-project",
      ProjectType.Project,
      true,
      {} as GCQFormState,
      {} as GithubProjectConflicts,
      true,
      repoData,
    );

  it("includes Run Every Mainline Commit in the Trigger Versions With Git Tags section", () => {
    const { schema } = getSchema();
    const githubSchema = (
      schema as {
        properties?: { github?: { properties?: Record<string, unknown> } };
      }
    )?.properties?.github?.properties;

    expect(githubSchema?.runEveryMainlineCommitTitle).toBeDefined();
    expect(githubSchema?.runEveryMainlineCommit).toBeDefined();
    expect(githubSchema?.runEveryMainlineCommitTitle).toMatchObject({
      title: "Run Every Mainline Commit",
    });
  });

  it("includes Run Every Mainline Commit uiSchema with correct data-cy", () => {
    const { uiSchema } = getSchema();

    expect(uiSchema?.github?.runEveryMainlineCommit?.["ui:data-cy"]).toBe(
      "run-every-mainline-commit-radio-box",
    );
    expect(
      uiSchema?.github?.runEveryMainlineCommitTitle?.["ui:sectionTitle"],
    ).toBe(true);
  });
});
