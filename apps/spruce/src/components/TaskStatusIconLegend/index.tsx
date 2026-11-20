import { useState } from "react";
import { Button, ButtonVariant } from "@via-ds/components/button";
import { Popover, PopoverRoot } from "@via-ds/components/popover";
import { Body, H6 } from "@via-ds/components/typography";
import QuestionMarkWithCircle from "@via-ds/icons/QuestionMarkWithCircle";
import X from "@via-ds/icons/X";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useWaterfallAnalytics } from "analytics";
import { PopoverContainer } from "components/styles/Popover";
import { TaskBox } from "components/TaskBox";
import { walkthroughSteps, waterfallGuideId } from "pages/waterfall/constants";
import styles from "./index.module.css";

const waterfallGroupedStatuses = [
  {
    icon: <TaskBox status={TaskStatus.Succeeded} />,
    statuses: [TaskStatus.Succeeded],
  },
  {
    icon: <TaskBox status={TaskStatus.Started} />,
    statuses: [TaskStatus.Started, TaskStatus.Dispatched],
  },
  {
    icon: <TaskBox status={TaskStatus.SystemFailed} />,
    statuses: [
      TaskStatus.SystemFailed,
      TaskStatus.SystemTimedOut,
      TaskStatus.SystemUnresponsive,
    ],
  },
  {
    icon: <TaskBox status={TaskStatus.Failed} />,
    statuses: [TaskStatus.Failed],
  },
  {
    icon: <TaskBox status={TaskStatus.KnownIssue} />,
    statuses: [TaskStatus.KnownIssue],
  },
  {
    icon: <TaskBox status={TaskStatus.TaskTimedOut} />,
    statuses: [TaskStatus.TaskTimedOut, TaskStatus.TestTimedOut],
  },
  {
    icon: <TaskBox status={TaskStatus.SetupFailed} />,
    statuses: [TaskStatus.SetupFailed],
  },
  {
    icon: <TaskBox status={TaskStatus.Unscheduled} />,
    statuses: [TaskStatus.Unscheduled, TaskStatus.Aborted, TaskStatus.Blocked],
  },
  {
    icon: <TaskBox status={TaskStatus.Undispatched} />,
    statuses: [TaskStatus.Undispatched, TaskStatus.WillRun],
  },
];

export const LegendContent: React.FC = () => (
  <div className={styles.container}>
    {waterfallGroupedStatuses.map(({ icon, statuses }) => (
      <div key={statuses.join()} className={styles.row}>
        <div className={styles.legendIcon}>{icon}</div>
        <div>
          {statuses.map((status) => (
            <Body key={status}>{taskStatusToCopy[status as TaskStatus]}</Body>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const legendProps = { [waterfallGuideId]: walkthroughSteps[1].targetId };

export const TaskStatusIconLegend: React.FC = () => {
  const { sendEvent } = useWaterfallAnalytics();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    sendEvent({
      name: "Toggled task icon legend",
      open: isOpen,
    });
    setOpen(isOpen);
  };

  return (
    <div {...legendProps}>
      <PopoverRoot
        align="end"
        isOpen={open}
        onOpenChange={handleOpenChange}
        side="top"
        triggerType="dialog"
      >
        <Button
          aria-label="Task status icon legend"
          variant={ButtonVariant.Tertiary}
        >
          <QuestionMarkWithCircle size="medium" />
        </Button>
        <Popover>
          <PopoverContainer className={styles.legendPopover}>
            <div className={styles.titleContainer}>
              <H6>Icon Legend</H6>
              <Button
                aria-label="Close task status icon legend"
                onPress={() => handleOpenChange(false)}
                variant={ButtonVariant.Tertiary}
              >
                <X size="medium" />
              </Button>
            </div>
            <LegendContent />
          </PopoverContainer>
        </Popover>
      </PopoverRoot>
    </div>
  );
};
