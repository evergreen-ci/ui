import { useRef, useState } from "react";
import { IconButton } from "@leafygreen-ui/icon-button";
import { Align, Justify, Popover } from "@leafygreen-ui/popover";
import { Body, Overline } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { useOnClickOutside } from "@evg-ui/lib/hooks";
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

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, popoverRef], () => setOpen(false));

  return (
    <div {...legendProps}>
      <IconButton
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
      </IconButton>
      <Popover
        ref={popoverRef}
        active={open}
        align={Align.Top}
        justify={Justify.End}
        refEl={buttonRef}
      >
        <PopoverContainer className={styles.legendPopover}>
          <div className={styles.titleContainer}>
            <Overline>Icon Legend</Overline>
            <IconButton
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
            </IconButton>
          </div>
          <LegendContent />
        </PopoverContainer>
      </Popover>
    </div>
  );
};
