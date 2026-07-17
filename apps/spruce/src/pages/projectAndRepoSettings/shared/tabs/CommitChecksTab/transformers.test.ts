import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import {
  type AliasFormType,
  AliasNames,
  VariantTaskSpecifier,
} from "../utils/alias";
import { formToGql, gqlToForm, mergeProjectRepo } from "./transformers";
import { CommitChecksFormState } from "./types";

const { projectBase, repoBase } = data;
const repoForm: CommitChecksFormState = {
  github: {
    githubChecks: {
      githubCheckAliases: [
        {
          alias: AliasNames.GithubCheck,
          description: "",
          gitTag: "",
          id: "2",
          parameters: [],
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: ["tTag"],
          },
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: ["vTag"],
          },
        } satisfies AliasFormType,
      ],
      githubCheckAliasesOverride: true,
    },
    githubChecksEnabled: true,
  },
};

describe("GithubCommitChecksTab transformers", () => {
  describe("repo data", () => {
    it("correctly converts from GQL to a form", () => {
      const form = gqlToForm(repoBase, {
        projectType: ProjectType.Repo,
      }) as CommitChecksFormState | null;
      expect(form).not.toBeNull();
      expect(form?.github.githubChecksEnabled).toBe(true);
      expect(form?.github.githubChecks.githubCheckAliases).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ alias: "__github_checks" }),
        ]),
      );
    });

    it("correctly converts from a form to GQL", () => {
      const result = formToGql(
        repoForm,
        true,
        "repo",
      ) as unknown as RepoSettingsInput;
      expect(result.repoId).toBe("repo");
      if (!result.projectRef) {
        throw new Error("projectRef was unexpectedly null");
      }
      expect(result.projectRef.githubChecksEnabled).toBe(true);
      expect(result.aliases).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ alias: "__github_checks" }),
        ]),
      );
    });
  });

  describe("project data", () => {
    it("correctly converts from GQL to a form", () => {
      const form = gqlToForm(projectBase, {
        projectType: ProjectType.AttachedProject,
      }) as CommitChecksFormState | null;
      expect(form).not.toBeNull();
      expect(form?.github.githubChecksEnabled).toBeNull();
      expect(form?.github.githubChecks.githubCheckAliases).toEqual([]);
    });

    it("correctly converts from a form to GQL", () => {
      const projectForm: CommitChecksFormState = {
        github: {
          githubChecks: {
            githubCheckAliases: [],
            githubCheckAliasesOverride: false,
          },
          githubChecksEnabled: null,
        },
      };
      const result = formToGql(
        projectForm,
        false,
        "project",
      ) as unknown as ProjectSettingsInput;
      expect(result.projectId).toBe("project");
      if (!result.projectRef) {
        throw new Error("projectRef was unexpectedly null");
      }
      expect(result.projectRef.githubChecksEnabled).toBeNull();
      expect(result.aliases).toEqual([]);
    });

    it("correctly merges project and repo form states (repo data as read-only)", () => {
      const projectForm: CommitChecksFormState = {
        github: {
          githubChecks: {
            githubCheckAliases: [],
            githubCheckAliasesOverride: false,
          },
          githubChecksEnabled: null,
        },
      };
      const merged = mergeProjectRepo(projectForm, repoForm);
      expect(merged.github.githubChecks.githubCheckAliases).toEqual([]);
      expect(merged.github.githubChecks.repoData).toEqual(
        repoForm.github.githubChecks,
      );
    });
  });
});
