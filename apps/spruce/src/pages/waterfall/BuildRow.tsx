import { memo, useCallback } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useWaterfallAnalytics } from "analytics";
import Icon from "components/Icon";
import { getTaskRoute, getVariantHistoryRoute } from "constants/routes";
import {
  BuildVariantTitle,
  columnBasis,
  gridGroupCss,
  InactiveVersion,
  Row,
  SQUARE_SIZE,
  taskStatusStyleMap,
} from "./styles";
import { Build, BuildVariant, WaterfallVersion } from "./types";

const { black, gray, white } = palette;

type Props = {
  build: BuildVariant;
  handlePinClick: () => void;
  lastActiveVersionId: string;
  pinned: boolean;
  projectIdentifier: string;
  versions: WaterfallVersion[];
};

export const BuildRow: React.FC<Props> = ({
  build,
  handlePinClick,
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
  return (
    <Row>
      <BuildVariantTitle data-cy="build-variant-label">
        <StyledIconButton
          active={pinned}
          aria-label="Pin build variant"
          data-cy="pin-button"
          onClick={handlePinClick}
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
      <BuildGroup data-cy="build-group">
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
                handleTaskClick={handleTaskClick}
                isRightmostBuild={b.version === lastActiveVersionId}
              />
            );
          }
          return <BuildContainer key={version?.id} />;
        })}
      </BuildGroup>
    </Row>
  );
};

const BuildGrid: React.FC<{
  build: Build;
  handleTaskClick: (s: string) => () => void;
  isRightmostBuild: boolean;
}> = ({ build, handleTaskClick, isRightmostBuild }) => (
  <BuildContainer
    onClick={(event: React.MouseEvent) => {
      handleTaskClick(
        (event.target as HTMLDivElement)?.getAttribute("status") ?? "",
      );
    }}
  >
    {build.tasks.map(
      ({ displayName, displayStatusCache, execution, id, status }) => {
        // Use status as backup for tasks created before displayStatusCache was introduced
        const taskStatus = (displayStatusCache || status) as TaskStatus;
        return (
          <SquareMemo
            key={id}
            data-tooltip={`${displayName} - ${taskStatusToCopy[taskStatus]}`}
            isRightmostBuild={isRightmostBuild}
            status={taskStatus}
            to={getTaskRoute(id, { execution })}
          />
        );
      },
    )}
  </BuildContainer>
);

const BuildGroup = styled.div`
  ${gridGroupCss}
  border: 1px solid ${gray.light2};
  border-radius: ${size.xs};
  padding-bottom: ${size.xs};
  padding-top: ${size.xs};
`;

const BuildContainer = styled.div`
  ${columnBasis}
`;

const StyledIconButton = styled(IconButton)`
  top: -${size.xxs};
  ${({ active }) => active && "transform: rotate(-30deg);"}
`;

const Square = styled(Link)<{ isRightmostBuild: boolean; status: TaskStatus }>`
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border: 1px solid ${white};
  box-sizing: content-box;
  float: left;
  cursor: pointer;
  position: relative;

  ${({ status }) => taskStatusStyleMap[status]}

  /* Tooltip */
  :before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 5px);
    left: 50%;
    transform: ${({ isRightmostBuild }) =>
      isRightmostBuild ? "translate(-90%)" : "translate(-50%)"};
    z-index: 1;
    width: max-content;
    max-width: 450px;
    overflow-wrap: break-word;
    padding: ${size.xs};
    border-radius: 6px;
    background: ${black};
    color: ${white};
    text-align: center;
    display: none;
  }
  :hover:before {
    display: block;
  }

  /* Tooltip caret */
  :hover:after {
    content: "";
    position: absolute;
    bottom: calc(100% - 5px);
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${black} transparent transparent transparent;
  }
`;

const SquareMemo = memo(Square);
