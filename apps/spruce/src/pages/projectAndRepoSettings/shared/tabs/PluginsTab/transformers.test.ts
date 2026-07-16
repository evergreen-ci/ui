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
  buildBaronSettings: {
    fileTicketWebhook: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      endpoint: null,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      secret: null,
    },
    ticketCreateIssueType: {
      issueType: "Epic",
    },
    ticketCreateProject: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      createProject: null,
    },
    ticketSearchProjects: [],
    useBuildBaron: false,
  },
  externalLinks: [
    {
      displayName: "a link display name",
      displayTitle: "a link display name",
      requesters: ["gitter_request", "patch_request"],
      urlTemplate: "https://a-link-template-{version_id}.com",
    },
    {
      displayName: "periodic build link",
      displayTitle: "periodic build link",
      requesters: ["ad_hoc"],
      urlTemplate: "https://periodic-build-{version_id}.com",
    },
  ],
  performanceSettings: {
    perfEnabled: true,
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    externalLinks: [
      {
        displayName: "a link display name",
        requesters: ["gitter_request", "patch_request"],
        urlTemplate: "https://a-link-template-{version_id}.com",
      },
      {
        displayName: "periodic build link",
        requesters: ["ad_hoc"],
        urlTemplate: "https://periodic-build-{version_id}.com",
      },
    ],
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
  },
};

const repoForm: PluginsFormState = {
  buildBaronSettings: {
    fileTicketWebhook: {
      endpoint: "endpoint",
      secret: "secret",
    },
    ticketCreateIssueType: {
      issueType: "Epic",
    },
    ticketCreateProject: {
      createProject: "EVG",
    },
    ticketSearchProjects: [
      {
        searchProject: "EVG",
      },
    ],
    useBuildBaron: false,
  },
  externalLinks: [
    {
      displayName: "a link display name",
      displayTitle: "a link display name",
      requesters: ["gitter_request", "patch_request"],
      urlTemplate: "https://a-link-template-{version_id}.com",
    },
    {
      displayName: "periodic build link",
      displayTitle: "periodic build link",
      requesters: ["ad_hoc"],
      urlTemplate: "https://periodic-build-{version_id}.com",
    },
  ],
  performanceSettings: {
    perfEnabled: true,
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef"> = {
  projectRef: {
    externalLinks: [
      {
        displayName: "a link display name",
        requesters: ["gitter_request", "patch_request"],
        urlTemplate: "https://a-link-template-{version_id}.com",
      },
      {
        displayName: "periodic build link",
        requesters: ["ad_hoc"],
        urlTemplate: "https://periodic-build-{version_id}.com",
      },
    ],
    id: "repo",
    perfEnabled: true,
    taskAnnotationSettings: {
      fileTicketWebhook: {
        endpoint: "endpoint",
        secret: "secret",
      },
    },
  },
  repoId: "repo",
};
