import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { spacing } from "@leafygreen-ui/tokens";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import { SQUARE_WITH_BORDER } from "components/TaskBox";
import VisibilityContainer from "components/VisibilityContainer";
import { getVariantHistoryRoute } from "constants/routes";
import { useDimensions } from "hooks/useDimensions";
import { useBuildVariantContext } from "./BuildVariantContext";
import { walkthroughSteps, waterfallGuideId } from "./constants";
import {
  BuildVariantTitle,
  columnBasis,
  gridGroupCss,
  InactiveVersion,
  Row,
} from "./styles";
import { Build, BuildVariant, GroupedVersion } from "./types";
import { WaterfallTask } from "./WaterfallTask";

const { gray } = palette;

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
  let buildIndex = 0;

  const { columnWidth } = useBuildVariantContext();

  const containerHeight = useMemo(
    () =>
      columnWidth !== 0
        ? calculateBVContainerHeight({ builds, columnWidth })
        : 0,
    [builds, columnWidth],
  );

  const containerStyles = useMemo(
    () => css`
      ${buildGroupCss};
      height: ${containerHeight}px;
    `,
    [containerHeight],
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

  return (
    <Row>
      <BuildVariantTitle data-cy="build-variant-label">
        <StyledIconButton
          active={pinned}
          aria-label="Pin build variant"
          data-cy="pin-button"
          onClick={handlePinClick}
          {...iconButtonProps}
        >
          <Icon glyph="Pin" />
        </StyledIconButton>
        <StyledLink
          data-cy="build-variant-link"
          href={getVariantHistoryRoute(projectIdentifier, build.id)}
          onClick={handleVariantClick}
        >
          {displayName}
        </StyledLink>
      </BuildVariantTitle>
      <VisibilityContainer
        containerCss={containerStyles}
        data-cy="build-group"
        offset={1000}
      >
        {versions.map(({ inactiveVersions, version }) => {
          if (inactiveVersions?.length) {
            return (
              <InactiveVersion
                key={inactiveVersions[0].id}
                data-cy="inactive-column"
              />
            );
          }
          /* The list of builds returned does not include a placeholder for inactive builds, so we need to check whether the build matches the version in the current column.
        Builds are sorted in descending revision order and so match the versions' sort order. */
          if (version && version.id === builds?.[buildIndex]?.version) {
            const b = builds[buildIndex];
            buildIndex += 1;
            return (
              <BuildGrid
                key={b.id}
                build={b}
                firstActiveTaskId={firstActiveTaskId}
                handleTaskClick={handleTaskClick}
                isRightmostBuild={b.version === lastActiveVersionId}
                openTaskId={openTaskId}
                setOpenTaskId={setOpenTaskId}
              />
            );
          }
          return <BuildContainer key={version?.id} />;
        })}
      </VisibilityContainer>
    </Row>
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
    <BuildContainer ref={containerRef} {...rest}>
      {children}
    </BuildContainer>
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

const padding = spacing[200];
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
  const numSquaresInRow = Math.floor(columnWidth / SQUARE_WITH_BORDER);
  const numRows = Math.ceil(numTasks / numSquaresInRow);
  return numRows * SQUARE_WITH_BORDER + containerPaddingAndBorder;
};

const buildGroupCss = css`
  ${gridGroupCss}
  border: ${border}px solid ${gray.light2};
  border-radius: ${size.xs};
  padding: ${padding}px;
`;

const BuildContainer = styled.div`
  ${columnBasis}
`;

const StyledIconButton = styled(IconButton)<{ active: boolean }>`
  top: -${size.xxs};
  ${({ active }) => active && "transform: rotate(-30deg);"}
`;
