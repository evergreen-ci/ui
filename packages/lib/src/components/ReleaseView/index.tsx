import styled from "@emotion/styled";
import { Card } from "@leafygreen-ui/card";
import { ExpandableCard } from "@leafygreen-ui/expandable-card";
import { Stepper, Step } from "@leafygreen-ui/stepper";
import { Subtitle, Link } from "@leafygreen-ui/typography";
import ReleaseStepBadge from "./ReleaseStepBadge";
import ReleaseStepDetails from "./ReleaseStepDetails";
import { ReleaseStepStatus, ReleaseStep, SubRelease } from "./types";

interface ReleaseViewCardProps {
  releaseName: string;
  steps: ReleaseStep[];
  links?: {
    label: string;
    href: string;
  }[];
  subRelease?: SubRelease | SubRelease[];
}

interface ReleaseHeaderProps {
  links?: {
    label: string;
    href: string;
  }[];
  releaseName: string;
  steps: ReleaseStep[];
}

const ReleaseHeader: React.FC<ReleaseHeaderProps> = ({
  links,
  releaseName,
  steps,
}) => {
  const currentStep = calculateStepCompletion(steps);

  return (
    <TitleContainer>
      <TitleContainerContent>
        <Subtitle>{releaseName}</Subtitle>
        {links && links.length > 0 && (
          <LinksContainer>
            {links.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </LinksContainer>
        )}
      </TitleContainerContent>
      <ReleaseStepBadge
        status={getOverallReleaseStatus(currentStep, steps.length)}
      />
    </TitleContainer>
  );
};

const ReleaseStepperComponent: React.FC<{ steps: ReleaseStep[] }> = ({
  steps,
}) => {
  const currentStep = calculateStepCompletion(steps);

  return (
    <StyledStepper currentStep={currentStep} maxDisplayedSteps={5}>
      {steps.map((step) => (
        <Step key={step.name}>
          <ReleaseStepDetails step={step} />
        </Step>
      ))}
    </StyledStepper>
  );
};

const ReleaseContent: React.FC<Omit<ReleaseViewCardProps, "subRelease">> = ({
  links,
  releaseName,
  steps,
}) => (
  <>
    <ReleaseHeader links={links} releaseName={releaseName} steps={steps} />
    <ReleaseStepperComponent steps={steps} />
  </>
);

const ReleaseViewCard: React.FC<ReleaseViewCardProps> = ({
  links,
  releaseName,
  steps,
  subRelease,
}) => {
  let subReleases: SubRelease[] = [];
  if (Array.isArray(subRelease)) {
    subReleases = subRelease;
  } else if (subRelease) {
    subReleases = [subRelease];
  }

  return (
    <Card>
      <ReleaseContent links={links} releaseName={releaseName} steps={steps} />
      {subReleases.map((sub) => (
        <StyledExpandableCard
          key={sub.releaseName}
          title={
            <ReleaseHeader
              links={sub.links}
              releaseName={sub.releaseName}
              steps={sub.steps}
            />
          }
        >
          <ReleaseStepperComponent steps={sub.steps} />
        </StyledExpandableCard>
      ))}
    </Card>
  );
};

const getOverallReleaseStatus = (currentStep: number, totalSteps: number) => {
  if (currentStep === 0) {
    return ReleaseStepStatus.NOT_STARTED;
  } else if (currentStep < totalSteps) {
    return ReleaseStepStatus.IN_PROGRESS;
  }
  return ReleaseStepStatus.COMPLETED;
};
const calculateStepCompletion = (steps: ReleaseStep[]) =>
  steps.reduce(
    (acc, step) =>
      step.status === ReleaseStepStatus.COMPLETED ? acc + 1 : acc,
    0,
  );

const LinksContainer = styled.div`
  display: flex;
  gap: 8px;
`;
const StyledStepper = styled(Stepper)`
  margin-top: 16px;
  width: 100%;
`;
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TitleContainerContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const StyledExpandableCard = styled(ExpandableCard)`
  margin-top: 16px;

  & > div[role="button"] {
    grid-template-columns: 1fr 24px;

    & > span {
      width: 100%;

      & > h6 {
        display: block !important;
        width: 100%;
      }
    }
  }
`;

export default ReleaseViewCard;
