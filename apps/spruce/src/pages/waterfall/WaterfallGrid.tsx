import { memo, useMemo } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Link, useParams } from "react-router-dom";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { getTaskRoute, slugs } from "constants/routes";
import { size } from "constants/tokens";
import {
  WaterfallBuild,
  WaterfallBuildVariant,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { VersionLabel } from "./VersionLabel";

const LIMIT = 5;
const { black, gray, green, white } = palette;

export const WaterfallGrid: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();

  const { data } = useSuspenseQuery<WaterfallQuery, WaterfallQueryVariables>(
    WATERFALL,
    {
      skip: !projectIdentifier,
      variables: {
        options: {
          // @ts-expect-error
          projectIdentifier,
          limit: LIMIT,
        },
      },
    },
  );

  const activeVersionIds = useMemo(
    () =>
      data.waterfall.versions.reduce((acc, { version }) => {
        if (version) {
          acc.push(version.id);
        }
        return acc;
      }, [] as string[]),
    [data.waterfall.versions],
  );

  return (
    <Container>
      <Row>
        <div /> {/* Placeholder div for the build variant label column */}
        {data.waterfall.versions.map(({ version }) =>
          version ? <VersionLabel key={version.id} {...version} /> : null,
        )}
      </Row>
      {data.waterfall.buildVariants.map((b) => (
        <BuildRow key={b.id} activeVersionIds={activeVersionIds} build={b} />
      ))}
    </Container>
  );
};

const BuildRow: React.FC<{
  activeVersionIds: string[];
  build: WaterfallBuildVariant;
}> = ({ activeVersionIds, build }) => {
  const { builds, displayName } = build;
  let buildIndex = 0;
  return (
    <Row>
      <BuildVariantTitle>{displayName}</BuildVariantTitle>
      {activeVersionIds.map((id) => {
        if (id === builds[buildIndex].version) {
          const b = builds[buildIndex];
          buildIndex += 1;
          return <BuildGrid key={b.id} build={b} />;
        }
        return <Build />;
      })}
    </Row>
  );
};

const BuildGrid: React.FC<{
  build: WaterfallBuild;
}> = ({ build }) => (
  <Build>
    {build.tasks.map(({ displayName, id, status }) => (
      <SquareMemo
        key={id}
        data-tooltip={displayName}
        status={status}
        to={getTaskRoute(id)}
      />
    ))}
  </Build>
);

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(${LIMIT + 1}, minmax(0, 1fr));
`;

const Row = styled.div`
  display: grid;
  grid-column: 1/-1;
  grid-template-columns: subgrid;

  > div {
    padding: ${size.xs};
    margin: ${size.xs} 0;
  }
`;

const BuildVariantTitle = styled.div`
  word-break: break-word;
`;

const borderStyle = `1px solid ${gray.light2}`;

const Build = styled.div`
  border-top: ${borderStyle};
  border-bottom: ${borderStyle};
  margin: 2px;

  &:nth-child(2) {
    border-left: ${borderStyle};
    border-radius: ${size.xs} 0 0 ${size.xs};
  }

  &:last-child {
    border-right: ${borderStyle};
    border-radius: 0 ${size.xs} ${size.xs} 0;
  }
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

  /* TODO DEVPROD-11368: Render colors for all statuses. Could potentially use background-image property to render icons. */
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
