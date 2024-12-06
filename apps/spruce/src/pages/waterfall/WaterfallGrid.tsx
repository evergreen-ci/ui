import { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { WATERFALL_PINNED_VARIANTS_KEY } from "constants/index";
import { WaterfallQuery } from "gql/generated/types";
import { useDimensions } from "hooks/useDimensions";
import { getObject, setObject } from "utils/localStorage";
import { BuildRow } from "./BuildRow";
import { InactiveVersionsButton } from "./InactiveVersions";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
} from "./styles";
import { useFilters } from "./useFilters";
import { useWaterfallTrace } from "./useWaterfallTrace";
import { VersionLabel, VersionLabelView } from "./VersionLabel";

type WaterfallGridProps = {
  projectIdentifier: string;
  data: WaterfallQuery;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  data,
  projectIdentifier,
}) => {
  useWaterfallTrace();

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
  }, [pins, projectIdentifier]);

  const refEl = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(
    refEl as React.MutableRefObject<HTMLElement>,
  );

  const { activeVersionIds, buildVariants, versions } = useFilters({
    flattenedBuilds: data.waterfall.flattenedBuilds,
    flattenedVersions: data.waterfall.flattenedVersions,
    pins,
  });

  const lastActiveVersionId = activeVersionIds[activeVersionIds.length - 1];

  return (
    <Container ref={refEl}>
      <Row>
        <BuildVariantTitle />
        <Versions data-cy="version-labels">
          {versions.map(({ inactiveVersions, version }) =>
            version ? (
              <VersionLabel view={VersionLabelView.Waterfall} {...version} />
            ) : (
              <InactiveVersion key={inactiveVersions?.[0].id}>
                <InactiveVersionsButton
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
          lastActiveVersionId={lastActiveVersionId}
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
