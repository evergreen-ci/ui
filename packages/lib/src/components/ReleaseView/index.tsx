import styled from "@emotion/styled";
import { Card } from "@leafygreen-ui/card";
import { Stepper, Step } from "@leafygreen-ui/stepper";
import { Subtitle, Link } from "@leafygreen-ui/typography";
import ReleaseStepBadge from "./ReleaseStepBadge";
import ReleaseStepDetails from "./ReleaseStepDetails";
import { ReleaseStepStatus, ReleaseStep } from "./types";

interface ReleaseViewCardProps {
  releaseName: string;
  steps: ReleaseStep[];
  links?: {
    label: string;
    href: string;
  }[];
}
const ReleaseViewCard: React.FC<ReleaseViewCardProps> = ({
  links,
  releaseName,
  steps,
}) => {
  // CurrentStep is the percentage of the steps that have the status "completed"
  const currentStep = calculateStepCompletion(steps);

  return (
    <Card>
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

      <StyledStepper currentStep={currentStep} maxDisplayedSteps={5}>
        {steps.map((step) => (
          <Step key={step.name}>
            <ReleaseStepDetails step={step} />
          </Step>
        ))}
      </StyledStepper>
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
  steps.reduce((acc, step) => {
    if (step.status === ReleaseStepStatus.COMPLETED) {
      return acc + 1;
    }
    return acc;
  }, 0);

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
`;

const TitleContainerContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
export default ReleaseViewCard;
