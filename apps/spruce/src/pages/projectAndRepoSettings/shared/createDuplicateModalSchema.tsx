/* eslint-disable check-file/filename-naming-convention */
import { Banner } from "@leafygreen-ui/banner";
import { Field } from "@rjsf/core";

export const projectName = {
  schema: {
    type: "string" as const,
    title: "Project Name",
    minLength: 1,
    format: "noSpecialCharacters",
  },
  uiSchema: {
    "ui:data-cy": "project-name-input",
  },
};

const enablePerformanceTooling = {
  schema: {
    type: "boolean" as const,
    title: "Enable performance tooling",
    default: false,
  },
  uiSchema: {
    "ui:data-cy": "enable-performance-tooling",
  },
};

const PerformanceToolingBanner: Field = () => (
  <Banner
    data-cy="performance-tooling-banner"
    style={{ marginBottom: "20px" }}
    variant="warning"
  >
    Please confirm these preferences before creating your project. You will not
    be able to configure the project for performance tooling at a later date.
  </Banner>
);

export const performanceTooling = {
  schema: {
    enablePerformanceTooling: enablePerformanceTooling.schema,
    performanceToolingBanner: {
      type: "null" as const,
    },
  },
  uiSchema: {
    enablePerformanceTooling: enablePerformanceTooling.uiSchema,
    performanceToolingBanner: {
      "ui:field": PerformanceToolingBanner,
      "ui:showLabel": false,
    },
  },
};

export const requestS3Creds = {
  schema: {
    type: "boolean" as const,
    title: "Open a JIRA ticket to request an S3 Bucket",
    default: false,
  },
  uiSchema: {
    "ui:data-cy": "request-s3-creds",
  },
};
