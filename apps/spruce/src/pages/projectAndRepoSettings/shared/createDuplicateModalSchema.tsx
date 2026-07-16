/* eslint-disable check-file/filename-naming-convention */
import { Banner, Variant } from "@leafygreen-ui/banner";
import { Field } from "@rjsf/core";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { backstageS3BucketUrl } from "constants/externalResources";

export const projectName = {
  schema: {
    format: "noSpecialCharacters",
    minLength: 1,
    title: "Project Name",
    type: "string" as const,
  },
  uiSchema: {
    "ui:data-cy": "project-name-input",
  },
};

const enablePerformanceTooling = {
  schema: {
    default: false,
    title: "Enable performance tooling",
    type: "boolean" as const,
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

const S3BucketInfoBanner: Field = () => (
  <Banner
    data-cy="s3-bucket-info-banner"
    style={{ marginBottom: "20px" }}
    variant={Variant.Info}
  >
    If you need an S3 bucket, you can set it up in{" "}
    <StyledLink href={backstageS3BucketUrl} target="_blank">
      Backstage
    </StyledLink>
    .
  </Banner>
);

export const s3BucketInfo = {
  schema: {
    type: "null" as const,
  },
  uiSchema: {
    "ui:field": S3BucketInfoBanner,
    "ui:showLabel": false,
  },
};
