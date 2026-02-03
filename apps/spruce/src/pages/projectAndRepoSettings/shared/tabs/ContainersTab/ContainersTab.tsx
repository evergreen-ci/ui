import { useMemo } from "react";
import { Banner } from "@leafygreen-ui/banner";
import { StyledLink } from "@evg-ui/lib/components";
import { containersOnboardingDocumentationUrl } from "constants/externalResources";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useSpruceConfig } from "hooks";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Containers;

export const ContainersTab: React.FC<TabProps> = ({
  projectData,
  repoData,
}) => {
  const initialFormState = projectData || repoData;

  const { providers } = useSpruceConfig() || {};
  const { aws } = providers || {};
  const { pod } = aws || {};
  const { ecs } = pod || {};

  const formSchema = useMemo(() => getFormSchema(ecs), [ecs]);

  if (!ecs) return null;

  return (
    <>
      <Banner variant="warning">
        We will not be implementing any new features or enhancements to our
        existing container offerings, but will continue to provide maintenance
        support for them. For more information on how to get started, please
        refer to our{" "}
        <StyledLink href={containersOnboardingDocumentationUrl}>
          container onboarding guide.
        </StyledLink>
      </Banner>
      <BaseTab
        formSchema={formSchema}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        initialFormState={initialFormState}
        tab={tab}
      />
    </>
  );
};
