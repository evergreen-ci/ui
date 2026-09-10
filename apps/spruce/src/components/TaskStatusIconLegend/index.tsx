import { useRef, useState } from "react";
import { Button, Popover, PopoverRoot, Text } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
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
            <Text key={status} textStyle="body">
              {taskStatusToCopy[status as TaskStatus]}
            </Text>
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

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div {...legendProps}>
      <PopoverRoot
        triggerType="dialog"
        isOpen={open}
        onOpenChange={setOpen}
        referenceElement={buttonRef}
      >
        <Button
          ref={buttonRef}
          aria-label="Task status icon legend"
          onClick={() => {
            sendEvent({
              name: "Toggled task icon legend",
              open: !open,
            });
            setOpen(!open);
          }}
        >
          <Icon glyph="QuestionMarkWithCircle" />
        </Button>
        <Popover>
          <PopoverContainer className={styles.legendPopover}>
            <div className={styles.titleContainer}>
              <Text textStyle="overline">Icon Legend</Text>
              <Button
                aria-label="Close task status icon legend"
                onClick={() => {
                  sendEvent({
                    name: "Toggled task icon legend",
                    open: false,
                  });
                  setOpen(false);
                }}
              >
                <Icon glyph="X" />
              </Button>
            </div>
            <LegendContent />
          </PopoverContainer>
        </Popover>
      </PopoverRoot>
    </div>
  );
};