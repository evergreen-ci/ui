import { useMemo, useRef } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  WaterfallQuery,
  WaterfallQueryVariables,
  WaterfallVersionFragment,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";
import { BuildRow } from "./BuildRow";
import { InactiveVersionsButton } from "./InactiveVersionsButton";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
  VERSION_LIMIT,
} from "./styles";
import { VersionLabel } from "./VersionLabel";

type WaterfallGridProps = {
  projectIdentifier: string;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  projectIdentifier,
}) => {
  const [requesters] = useQueryParam(
    WaterfallFilterOptions.Requesters,
    [] as string[],
  );

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

  const [versions, activeVersionIds] = useMemo(() => {
    const activeIds: Set<string> = new Set();
    const newRolledUpArray: typeof data.waterfall.versions = [];

    const pushInactive = (v: WaterfallVersionFragment) => {
      if (!newRolledUpArray?.[newRolledUpArray.length - 1]?.inactiveVersions) {
        newRolledUpArray.push({ version: null, inactiveVersions: [] });
      }
      newRolledUpArray[newRolledUpArray.length - 1].inactiveVersions?.push(v);
    };

    const pushActive = (v: WaterfallVersionFragment) => {
      newRolledUpArray.push({
        inactiveVersions: null,
        version: v,
      });
    };

    data.waterfall.versions.forEach(({ inactiveVersions, version }) => {
      if (version) {
        if (
          !requesters.length ||
          requesters?.some((r) => r === version.requester)
        ) {
          pushActive(version);
          activeIds.add(version.id);
        } else {
          pushInactive(version);
        }
      } else if (inactiveVersions) {
        inactiveVersions.forEach((iv) => pushInactive(iv));
      }
    });

    return [newRolledUpArray, activeIds];
  }, [data, requesters]);

  const hasFilters = useMemo(() => requesters.length, [requesters]);

  const buildVariants = useMemo(() => {
    if (!hasFilters) {
      return data.waterfall.buildVariants;
    }

    const bvs: typeof data.waterfall.buildVariants = [];
    data.waterfall.buildVariants.forEach((bv) => {
      if (activeVersionIds.size !== bv.builds.length) {
        const activeBuilds: typeof bv.builds = [];
        bv.builds.forEach((b) => {
          if (activeVersionIds.has(b.version)) {
            activeBuilds.push(b);
          }
        });
        if (activeBuilds.length) {
          bvs.push({ ...bv, builds: activeBuilds });
        }
      } else {
        bvs.push(bv);
      }
    });
    return bvs;
  }, [data, activeVersionIds]);

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
