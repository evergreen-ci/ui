import { memo, useCallback } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useWaterfallAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { getTaskRoute, getVariantHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import {
  WaterfallBuild,
  WaterfallBuildVariant,
  WaterfallQuery,
} from "gql/generated/types";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
} from "./styles";

const { black, gray, green, white } = palette;

export const BuildRow: React.FC<{
  build: WaterfallBuildVariant;
  projectIdentifier: string;
  versions: WaterfallQuery["waterfall"]["versions"];
}> = ({ build, projectIdentifier, versions }) => {
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
      <BuildVariantTitle>
        <StyledLink
          href={getVariantHistoryRoute(projectIdentifier, build.id)}
          onClick={handleVariantClick}
        >
          {displayName}
        </StyledLink>
      </BuildVariantTitle>
      <BuildGroup data-cy="build-group">
        {versions.map(({ inactiveVersions, version }) => {
          if (inactiveVersions) {
            return <InactiveVersion data-cy="inactive-column" />;
          }
          // The list of builds returned does not include a placeholder for inactive builds, so we need to check whether the build matches the version in the current column
          if (version && version.id === builds?.[buildIndex]?.version) {
            const b = builds[buildIndex];
            buildIndex += 1;
            return (
              <BuildGrid
                key={b.id}
                build={b}
                handleTaskClick={handleTaskClick}
              />
            );
          }
          return <Build />;
        })}
      </BuildGroup>
    </Row>
  );
};

const BuildGrid: React.FC<{
  build: WaterfallBuild;
  handleTaskClick: (s: string) => () => void;
}> = ({ build, handleTaskClick }) => (
  <Build>
    {build.tasks.map(({ displayName, id, status }) => (
      <SquareMemo
        key={id}
        data-tooltip={displayName}
        onClick={handleTaskClick(status)}
        status={status}
        to={getTaskRoute(id)}
      />
    ))}
  </Build>
);

const BuildGroup = styled.div`
  ${gridGroupCss}
  border: 1px solid ${gray.light2};
  border-radius: ${size.xs};
  padding-bottom: ${size.xs};
  padding-top: ${size.xs};
`;

const Build = styled.div`
  flex-basis: 20%;
`;

const SQUARE_SIZE = 16;

const Square = styled(Link)<{ status: string }>`
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border: 1px solid ${white};
  box-sizing: content-box;
  float: left;
  cursor: pointer;
  position: relative;

  /* TODO DEVPROD-11368: Render colors for all statuses. Could use background-image property to render icons. */
  ${({ status }) =>
    status === TaskStatus.Succeeded
      ? `background-color: ${green.dark1};`
      : `background-color: ${gray.light2};
  `}

  /* Tooltip */
  :before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 5px);
    left: 50%;
    transform: translate(-50%);
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
