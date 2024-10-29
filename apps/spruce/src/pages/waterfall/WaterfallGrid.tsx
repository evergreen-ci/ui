import { useCallback, useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import {
  DEFAULT_POLL_INTERVAL,
  WATERFALL_PINNED_VARIANTS_KEY,
} from "constants/index";
import { WaterfallQuery, WaterfallQueryVariables } from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useDimensions } from "hooks/useDimensions";
import { getObject, setObject } from "utils/localStorage";
import { BuildRow } from "./BuildRow";
import { InactiveVersionsButton } from "./InactiveVersionsButton";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
  VERSION_LIMIT,
} from "./styles";
import { useFilters } from "./useFilters";
import { VersionLabel } from "./VersionLabel";

type WaterfallGridProps = {
  projectIdentifier: string;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  projectIdentifier,
}) => {
  const [pins, setPins] = useState<string[]>(
    getObject(WATERFALL_PINNED_VARIANTS_KEY)?.[projectIdentifier] ?? [],
  );

  const handlePinBV = useCallback(
    (buildVariant: string) => () => {
      setPins((prev: string[]) => {
        const bvIndex = prev.indexOf(buildVariant);
        if (bvIndex > -1) {
          const removed = [...prev];
          removed.splice(bvIndex, 1);
          return removed;
        }
        return [...prev, buildVariant];
      });
    },
    [],
  );

  useEffect(() => {
    const bvs = getObject(WATERFALL_PINNED_VARIANTS_KEY);
    setObject(WATERFALL_PINNED_VARIANTS_KEY, {
      ...bvs,
      [projectIdentifier]: pins,
    });
  }, [pins]);

  const { data } = useSuspenseQuery<WaterfallQuery, WaterfallQueryVariables>(
    WATERFALL,
    {
      variables: {
        options: {
          projectIdentifier,
          limit: VERSION_LIMIT,
        },
      },
      // @ts-expect-error pollInterval isn't officially supported by useSuspenseQuery, but it works so let's use it anyway.
      pollInterval: DEFAULT_POLL_INTERVAL,
    },
  );
  const refEl = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(
    refEl as React.MutableRefObject<HTMLElement>,
  );

  const { buildVariants, versions } = useFilters(data.waterfall, pins);

  return (
    <Container ref={refEl}>
      <Row>
        <BuildVariantTitle />
        <Versions data-cy="version-labels">
          {versions.map(({ inactiveVersions, version }) =>
            version ? (
              <VersionLabel key={version.id} size="small" {...version} />
            ) : (
              <InactiveVersion>
                <InactiveVersionsButton
                  key={inactiveVersions?.[0].id}
                  containerHeight={height}
                  versions={inactiveVersions ?? []}
                />
              </InactiveVersion>
            ),
          )}
        </Versions>
      </Row>
      {buildVariants.map((b) => (
        <BuildRow
          key={b.id}
          build={b}
          handlePinClick={handlePinBV(b.id)}
          pinned={pins.includes(b.id)}
          projectIdentifier={projectIdentifier}
          versions={versions}
        />
      ))}
    </Container>
  );
};

const Container = styled.div``;

const Versions = styled.div`
  ${gridGroupCss}
`;
