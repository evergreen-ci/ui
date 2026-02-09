import { memo, useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { spacing } from "@leafygreen-ui/tokens";
import { Link } from "react-router-dom";
import { Icon, StyledLink } from "@evg-ui/lib/components";
import { size, taskStatusToCopy } from "@evg-ui/lib/constants";
import { TaskStatus } from "@evg-ui/lib/types";
import { useWaterfallAnalytics } from "analytics";
import { SQUARE_WITH_BORDER, TaskBox } from "components/TaskBox";
import VisibilityContainer from "components/VisibilityContainer";
import { getTaskRoute, getVariantHistoryRoute } from "constants/routes";
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

const { gray } = palette;

type Props = {
  build: BuildVariant;
  handlePinClick: () => void;
  isFirstBuild: boolean;
  lastActiveVersionId: string;
  pinned: boolean;
  projectIdentifier: string;
  versions: GroupedVersion[];
};

export const BuildRow: React.FC<Props> = ({
  build,
  handlePinClick,
  isFirstBuild,
  lastActiveVersionId,
  pinned,
  projectIdentifier,
  versions,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const handleVariantClick = useCallback(
    () => sendEvent({ name: "Clicked variant label" }),
    [sendEvent],
  );
  const handleTaskClick = useCallback(
    (status: string) => () =>
      sendEvent({
        name: "Clicked task box",
        "task.status": status,
      }),
    [sendEvent],
  );

  const { builds, displayName } = build;
  let buildIndex = 0;

  const [containerHeight, setContainerHeight] = useState(0);
  const { columnWidth } = useBuildVariantContext();

  useEffect(() => {
    if (columnWidth !== 0) {
      const bvContainerHeight = calculateBVContainerHeight({
        builds,
        columnWidth,
      });
      setContainerHeight(bvContainerHeight);
    }
  }, [builds, columnWidth]);

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
        containerCss={css`
          ${buildGroupCss};
          height: ${containerHeight}px;
        `}
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
              />
            );
          }
          return <BuildContainer key={version?.id} />;
        })}
      </VisibilityContainer>
    </Row>
  );
};

const WidthWatcher: React.FC<{
  children: React.ReactNode;
  onClick: (event: React.MouseEvent) => void;
}> = ({ children, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions<HTMLDivElement>(containerRef);
  const { columnWidth, setColumnWidth } = useBuildVariantContext();

  useEffect(() => {
    if (width !== 0 && columnWidth !== width) {
      setColumnWidth(width);
    }
  }, [setColumnWidth, columnWidth, width]);

  return (
    <BuildContainer ref={containerRef} onClick={onClick}>
      {children}
    </BuildContainer>
  );
};

const BuildGrid: React.FC<{
  build: Build;
  firstActiveTaskId: string;
  handleTaskClick: (s: string) => () => void;
  isRightmostBuild: boolean;
}> = ({ build, firstActiveTaskId, handleTaskClick, isRightmostBuild }) => {
  const handleClick = (event: React.MouseEvent) => {
    handleTaskClick(
      (event.target as HTMLDivElement)?.getAttribute("status") ?? "",
    )();
  };

  return (
    <WidthWatcher onClick={handleClick}>
      {build.tasks.map(({ displayName, displayStatusCache, execution, id }) => {
        const squareProps =
          id === firstActiveTaskId
            ? { [waterfallGuideId]: walkthroughSteps[0].targetId }
            : {};
        const taskStatus = displayStatusCache as TaskStatus;
        return (
          <SquareMemo
            key={id}
            as={Link}
            data-tooltip={`${displayName} - ${taskStatusToCopy[taskStatus]}`}
            rightmost={isRightmostBuild}
            status={taskStatus}
            to={getTaskRoute(id, { execution })}
            tooltip={`${displayName} - ${taskStatusToCopy[taskStatus]}`}
            {...squareProps}
          />
        );
      })}
    </WidthWatcher>
  );
};

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

const SquareMemo = memo(TaskBox);
