import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";

import { PluginsFormState } from "./types";

const { projectBase, repoBase } = data;

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(repoBase)).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, true, "repo")).toStrictEqual(repoResult);
  });
});

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectForm, false, "project")).toStrictEqual(
      projectResult,
    );
  });
});

const projectForm: PluginsFormState = {
  performanceSettings: {
    perfEnabled: true,
  },
  buildBaronSettings: {
    ticketCreateProject: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      createProject: null,
    },
    ticketCreateIssueType: {
      issueType: "Epic",
    },
    ticketSearchProjects: [],
    useBuildBaron: false,
    fileTicketWebhook: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      endpoint: null,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      secret: null,
    },
  },
  externalLinks: [
    {
      requesters: ["gitter_request", "patch_request"],
      displayName: "a link display name",
      displayTitle: "a link display name",
      urlTemplate: "https://a-link-template-{version_id}.com",
    },
    {
      requesters: ["ad_hoc"],
      displayName: "periodic build link",
      displayTitle: "periodic build link",
      urlTemplate: "https://periodic-build-{version_id}.com",
    },
  ],
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    id: "project",
    perfEnabled: true,
    taskAnnotationSettings: {
      fileTicketWebhook: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        endpoint: null,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        secret: null,
      },
    },
    externalLinks: [
      {
        requesters: ["gitter_request", "patch_request"],
        displayName: "a link display name",
        urlTemplate: "https://a-link-template-{version_id}.com",
      },
      {
        requesters: ["ad_hoc"],
        displayName: "periodic build link",
        urlTemplate: "https://periodic-build-{version_id}.com",
      },
    ],
  },
};

const repoForm: PluginsFormState = {
  performanceSettings: {
    perfEnabled: true,
  },
  buildBaronSettings: {
    ticketSearchProjects: [
      {
        searchProject: "EVG",
      },
    ],
    ticketCreateProject: {
      createProject: "EVG",
    },
    ticketCreateIssueType: {
      issueType: "Epic",
    },
    useBuildBaron: false,
    fileTicketWebhook: {
      endpoint: "endpoint",
      secret: "secret",
    },
  },
  externalLinks: [
    {
      requesters: ["gitter_request", "patch_request"],
      displayName: "a link display name",
      displayTitle: "a link display name",
      urlTemplate: "https://a-link-template-{version_id}.com",
    },
    {
      requesters: ["ad_hoc"],
      displayName: "periodic build link",
      displayTitle: "periodic build link",
      urlTemplate: "https://periodic-build-{version_id}.com",
    },
  ],
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef"> = {
  repoId: "repo",
  projectRef: {
    id: "repo",
    perfEnabled: true,
    taskAnnotationSettings: {
      fileTicketWebhook: {
        endpoint: "endpoint",
        secret: "secret",
      },
    },
    externalLinks: [
      {
        requesters: ["gitter_request", "patch_request"],
        displayName: "a link display name",
        urlTemplate: "https://a-link-template-{version_id}.com",
      },
      {
        requesters: ["ad_hoc"],
        displayName: "periodic build link",
        urlTemplate: "https://periodic-build-{version_id}.com",
      },
    ],
  },
};
