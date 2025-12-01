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

export { ReleaseStepStatus, type ReleaseStep };
