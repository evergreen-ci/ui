import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { useWaterfallAnalytics } from "analytics";
import { SQUARE_WITH_BORDER } from "components/TaskBox";
import VisibilityContainer from "components/VisibilityContainer";
import { getVariantHistoryRoute } from "constants/routes";
import { useDimensions } from "hooks/useDimensions";
import styles from "./BuildRow.module.css";
import { useBuildVariantContext } from "./BuildVariantContext";
import { walkthroughSteps, waterfallGuideId } from "./constants";
import sharedStyles from "./styles.module.css";
import { Build, BuildVariant, GroupedVersion } from "./types";
import { WaterfallTask } from "./WaterfallTask";

type Props = {
  build: BuildVariant;
  isFirstBuild: boolean;
  lastActiveVersionId: string;
  onPinClick: (buildVariant: string, wasPinned: boolean) => void;
  pinned: boolean;
  projectIdentifier: string;
  versions: GroupedVersion[];
};

const BuildRowInner: React.FC<Props> = ({
  build,
  isFirstBuild,
  lastActiveVersionId,
  onPinClick,
  pinned,
  projectIdentifier,
  versions,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const handlePinClick = useCallback(
    () => onPinClick(build.id, pinned),
    [onPinClick, build.id, pinned],
  );

  const handleVariantClick = useCallback(
    () => sendEvent({ name: "Clicked variant label" }),
    [sendEvent],
  );

  const handleTaskClick = useCallback(
    (taskId: string, e: React.MouseEvent<HTMLElement>) => {
      // Open the popup on Alt + Click.
      if (e.altKey) {
        e.preventDefault();
        setOpenTaskId((prev) => (prev === taskId ? null : taskId));
        sendEvent({
          name: "Clicked task overview popup",
          "task.id": taskId,
        });
      } else {
        const status = (e.target as HTMLElement)?.dataset.status ?? "";
        sendEvent({
          name: "Clicked task box",
          "task.status": status,
        });
      }
    },
    [sendEvent, setOpenTaskId],
  );

  const { builds, displayName } = build;

  const { columnWidth } = useBuildVariantContext();

  const containerHeight = useMemo(
    () =>
      columnWidth !== 0
        ? calculateBVContainerHeight({ builds, columnWidth })
        : 0,
    [builds, columnWidth],
  );

  const iconButtonProps = isFirstBuild
    ? { [waterfallGuideId]: walkthroughSteps[2].targetId }
    : {};

  let firstActiveTaskId = "";
  if (isFirstBuild) {
    for (let i = 0; i < builds.length; i++) {
      if (builds[i].tasks.length > 0) {
        firstActiveTaskId = builds[i].tasks[0].id;
        break;
      }
    }
  }

  const buildColumns: React.ReactNode[] = [];
  let buildIndex = 0;
  for (const { inactiveVersions, version } of versions) {
    if (inactiveVersions?.length) {
      buildColumns.push(
        <div
          key={inactiveVersions[0].id}
          className={sharedStyles.inactiveVersion}
          data-testid="inactive-column"
        />,
      );
    } else if (version && version.id === builds?.[buildIndex]?.version) {
      /* The list of builds returned does not include a placeholder for inactive builds, so we need to check whether the build matches the version in the current column.
      Builds are sorted in descending revision order and so match the versions' sort order. */
      const b = builds[buildIndex];
      buildIndex += 1;
      buildColumns.push(
        <BuildGrid
          key={b.id}
          build={b}
          firstActiveTaskId={firstActiveTaskId}
          handleTaskClick={handleTaskClick}
          isRightmostBuild={b.version === lastActiveVersionId}
          openTaskId={openTaskId}
          setOpenTaskId={setOpenTaskId}
        />,
      );
    } else {
      buildColumns.push(
        <div key={version?.id} className={styles.buildContainer} />,
      );
    }
  }

  return (
    <div className={sharedStyles.row}>
      <div
        className={sharedStyles.buildVariantTitle}
        data-testid="build-variant-label"
      >
        <Button
          aria-label="Pin build variant"
          className={styles.pinButton}
          data-active={pinned}
          data-testid="pin-button"
          onPress={handlePinClick}
          size="small"
          variant="tertiary"
          {...iconButtonProps}
        >
          <Icon glyph="Pin" />
        </Button>
        <StyledLink
          data-testid="build-variant-link"
          href={getVariantHistoryRoute(projectIdentifier, build.id)}
          onClick={handleVariantClick}
        >
          {displayName}
        </StyledLink>
      </div>
      <VisibilityContainer
        className={styles.buildGroup}
        data-testid="build-group"
        offset={1000}
        style={{ minHeight: containerHeight }}
      >
        {buildColumns}
      </VisibilityContainer>
    </div>
  );
};

export const BuildRow = memo(BuildRowInner);

const WidthWatcher: React.FC<
  {
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({ children, ...rest }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions<HTMLDivElement>(containerRef);
  const { columnWidth, setColumnWidth } = useBuildVariantContext();

  useEffect(() => {
    if (width !== 0 && columnWidth !== width) {
      setColumnWidth(width);
    }
  }, [setColumnWidth, columnWidth, width]);

  return (
    <div ref={containerRef} className={styles.buildContainer} {...rest}>
      {children}
    </div>
  );
};

const BuildGrid: React.FC<{
  build: Build;
  firstActiveTaskId: string;
  handleTaskClick: (taskId: string, e: React.MouseEvent<HTMLElement>) => void;
  isRightmostBuild: boolean;
  openTaskId: string | null;
  setOpenTaskId: (taskId: string | null) => void;
}> = ({
  build,
  firstActiveTaskId,
  handleTaskClick,
  isRightmostBuild,
  openTaskId,
  setOpenTaskId,
}) => (
  <WidthWatcher data-rightmost-build={isRightmostBuild || undefined}>
    {build.tasks.map((task) => (
      <WaterfallTask
        key={task.id}
        handleTaskClick={handleTaskClick}
        isFirstActiveTask={task.id === firstActiveTaskId}
        isRightmostBuild={isRightmostBuild}
        open={openTaskId === task.id}
        setOpenTaskId={setOpenTaskId}
        task={task}
      />
    ))}
  </WidthWatcher>
);

const padding = 8;
const border = 1;
const containerPaddingAndBorder = padding * 2 + border * 2;

const calculateBVContainerHeight = ({
  builds,
  columnWidth,
}: {
  builds: Build[];
  columnWidth: number;
}) => {
  const numTasks = Math.max(...builds.map((b) => b.tasks.length));
  const numSquaresInRow = Math.max(
    Math.floor(columnWidth / SQUARE_WITH_BORDER),
    1,
  );
  const numRows = Math.ceil(numTasks / numSquaresInRow);
  return numRows * SQUARE_WITH_BORDER + containerPaddingAndBorder;
};
