enum ReleaseStepStatus {
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
  NOT_STARTED = "not_started",
}
type ReleaseStep = {
  name: string;
  status: ReleaseStepStatus;
  duration: number;
};

type SubRelease = {
  releaseName: string;
  steps: ReleaseStep[];
  links?: {
    label: string;
    href: string;
  }[];
};

export { ReleaseStepStatus, type ReleaseStep, type SubRelease };
