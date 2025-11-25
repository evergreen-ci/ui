import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Tab } from "@leafygreen-ui/tabs";
import { TextInput } from "@leafygreen-ui/text-input";
import { useNavigate } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePatchAnalytics } from "analytics";
import { TaskSchedulingWarningBanner } from "components/Banners/TaskSchedulingWarningBanner";
import { LoadingButton } from "components/Buttons";
import { CodeChanges } from "components/CodeChanges";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
import { PageContent, PageLayout, PageSider } from "components/styles";
import { StyledTabs } from "components/styles/StyledTabs";
import { getProjectPatchesRoute, getVersionRoute } from "constants/routes";
import {
  SchedulePatchMutation,
  PatchConfigure,
  SchedulePatchMutationVariables,
  VariantTasks,
  ChildPatchAlias,
  ConfigurePatchQuery,
  ProjectBuildVariant,
  PatchConfigureGeneratedTaskCountsQuery,
} from "gql/generated/types";
import { SCHEDULE_PATCH } from "gql/mutations";
import { sumActivatedTasksInVariantsTasks } from "utils/tasks/estimatedActivatedTasks";
import { ConfigureBuildVariants } from "./ConfigureBuildVariants";
import ConfigureTasks from "./ConfigureTasks";
import { ParametersContent } from "./ParametersContent";
import useConfigurePatch from "./useConfigurePatch";
import { indexToTabMap, tabToIndexMap } from "./useConfigurePatch/constants";
import {
  AliasState,
  ChildPatchAliased,
  PatchTriggerAlias,
  VariantTasksState,
} from "./useConfigurePatch/types";

interface ConfigurePatchCoreProps {
  patch: ConfigurePatchQuery["patch"];
  generatedTaskCounts: PatchConfigureGeneratedTaskCountsQuery["patch"]["generatedTaskCounts"];
  loadingGeneratedTaskCounts: boolean;
}
const ConfigurePatchCore: React.FC<ConfigurePatchCoreProps> = ({
  generatedTaskCounts,
  loadingGeneratedTaskCounts,
  patch,
}) => {
  const navigate = useNavigate();
  const dispatchToast = useToastContext();

  const {
    activated,
    author,
    childPatchAliases,
    childPatches,
    githubPatchData,
    id,
    patchTriggerAliases,
    project,
    projectID,
    projectIdentifier,
    time,
    variantsTasks,
    versionFull,
  } = patch;
  const { variants = [] } = project || {};

  const childPatchesWithAliases: ChildPatchAliased[] =
    childPatches?.map((cp) => {
      const { alias = id } =
        childPatchAliases?.find(({ patchId }) => cp.id === patchId) || {};
      return { ...cp, alias };
    }) ?? [];

  const selectableAliases = useMemo(
    () => filterAliases(patchTriggerAliases, childPatchAliases || []),
    [patchTriggerAliases, childPatchAliases],
  );

  const initialPatch = useMemo(
    () => ({ ...patch, patchTriggerAliases: selectableAliases }),
    [patch, selectableAliases],
  );

  const {
    description,
    disableBuildVariantSelect,
    patchParams,
    selectedAliases,
    selectedBuildVariantTasks,
    selectedBuildVariants,
    selectedTab,
    setDescription,
    setPatchParams,
    setSelectedAliases,
    setSelectedBuildVariantTasks,
    setSelectedBuildVariants,
    setSelectedTab,
  } = useConfigurePatch(initialPatch);

  const { sendEvent } = usePatchAnalytics(id);

  const totalSelectedTaskCount = Object.values(
    selectedBuildVariantTasks,
  ).reduce(
    (count, taskObj) => count + Object.values(taskObj).filter((v) => v).length,
    0,
  );

  const aliasCount = Object.values(selectedAliases).reduce(
    (count, alias) => count + (alias ? 1 : 0),
    0,
  );

  const [schedulePatch, { loading: loadingScheduledPatch }] = useMutation<
    SchedulePatchMutation,
    SchedulePatchMutationVariables
  >(SCHEDULE_PATCH, {
    onCompleted(data) {
      const { schedulePatch: scheduledPatch } = data;
      const hasChildPatch = scheduledPatch.versionFull?.childVersions?.length;
      dispatchToast.success(
        `Successfully scheduled the patch${hasChildPatch ? " and its child patches" : ""}`,
      );
      if (scheduledPatch.versionFull) {
        navigate(getVersionRoute(scheduledPatch.versionFull.id));
      }
    },
    onError(err) {
      dispatchToast.error(
        `There was an error scheduling this patch : ${err.message}`,
      );
    },
    refetchQueries: ["VersionTasks", "VersionTaskDurations"],
  });

  const onClickSchedule = async (): Promise<void> => {
    const configurePatchParam: PatchConfigure = {
      description,
      variantsTasks: toGQLVariantTasksType(selectedBuildVariantTasks),
      parameters: patchParams,
      patchTriggerAliases: toGQLAliasType(selectedAliases),
    };
    schedulePatch({
      variables: { patchId: id, configure: configurePatchParam },
    });
    sendEvent({
      name: "Clicked schedule patch button",
      "task.scheduled_count": totalSelectedTaskCount,
      "aliases.scheduled_count": aliasCount,
    });
  };

  if (variants.length === 0) {
    return (
      // TODO: Full page error
      <PageLayout>
        <div data-cy="full-page-error">
          Something went wrong. This patch&apos;s project either has no variants
          or no tasks associated with it.{" "}
        </div>
      </PageLayout>
    );
  }

  const isUnauthorizedGHPatch = !versionFull?.id && githubPatchData?.prNumber;

  const estimatedActivatedTasksCount = sumActivatedTasksInVariantsTasks(
    selectedBuildVariantTasks,
    generatedTaskCounts || [],
    initialPatch.variantsTasks,
  );

  return (
    <>
      <FlexRow>
        <StyledInput
          data-cy="patch-name-input"
          label="Patch Name"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <ButtonWrapper>
          {activated && (
            <Button
              data-cy="cancel-button"
              onClick={() =>
                window.history.state.idx > 0
                  ? navigate(-1)
                  : navigate(getVersionRoute(id))
              }
            >
              Cancel
            </Button>
          )}
          <LoadingButton
            data-cy="schedule-patch"
            disabled={totalSelectedTaskCount === 0 && aliasCount === 0}
            loading={loadingScheduledPatch || loadingGeneratedTaskCounts}
            onClick={onClickSchedule}
            /* @ts-expect-error - the native title attribute works here */
            title={
              loadingGeneratedTaskCounts
                ? "Still estimating total task count"
                : undefined
            }
            variant="primary"
          >
            {isUnauthorizedGHPatch ? "Authorize & Schedule" : "Schedule"}
          </LoadingButton>
        </ButtonWrapper>
      </FlexRow>
      <BannerContainer>
        <TaskSchedulingWarningBanner
          totalTasks={estimatedActivatedTasksCount}
        />
      </BannerContainer>
      <PageLayout hasSider>
        <PageSider>
          <MetadataCard title="Patch Metadata">
            <MetadataItem>
              <MetadataLabel>Submitted by:</MetadataLabel> {author}
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Submitted at:</MetadataLabel> {time?.submittedAt}
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Project:</MetadataLabel>{" "}
              <StyledRouterLink
                to={getProjectPatchesRoute(projectIdentifier || projectID)}
              >
                {projectIdentifier || projectID}
              </StyledRouterLink>
            </MetadataItem>
          </MetadataCard>
          <ConfigureBuildVariants
            aliases={[
              ...getPatchTriggerAliasEntries(
                selectableAliases,
                selectedAliases,
              ),
              ...getChildPatchEntries(childPatchesWithAliases),
            ]}
            disabled={disableBuildVariantSelect}
            selectedBuildVariants={selectedBuildVariants}
            setSelectedBuildVariants={setSelectedBuildVariants}
            variants={getVariantEntries(variants, selectedBuildVariantTasks)}
          />
        </PageSider>
        <PageContent>
          <StyledTabs
            aria-label="Configure Patch Tabs"
            onValueChange={(i: number) => setSelectedTab(indexToTabMap[i])}
            value={tabToIndexMap[selectedTab]}
          >
            <Tab data-cy="tasks-tab" name="Configure">
              <ConfigureTasks
                activated={activated}
                activatedVariants={variantsTasks}
                aliasCount={aliasCount}
                childPatches={childPatchesWithAliases}
                selectableAliases={selectableAliases}
                selectedAliases={selectedAliases}
                selectedBuildVariants={selectedBuildVariants}
                selectedBuildVariantTasks={selectedBuildVariantTasks}
                setSelectedAliases={setSelectedAliases}
                setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
                totalSelectedTaskCount={totalSelectedTaskCount}
              />
            </Tab>
            <Tab data-cy="changes-tab" name="Changes">
              <CodeChanges patchId={id} />
            </Tab>
            <Tab data-cy="parameters-tab" name="Parameters">
              <ParametersContent
                patchActivated={activated}
                patchParameters={patchParams}
                setPatchParams={setPatchParams}
              />
            </Tab>
          </StyledTabs>
        </PageContent>
      </PageLayout>
    </>
  );
};

const getVariantEntries = (
  variants: ProjectBuildVariant[],
  selectedBuildVariantTasks: VariantTasksState,
) =>
  variants.map(({ displayName, name }) => ({
    displayName,
    name,
    taskCount: selectedBuildVariantTasks[name]
      ? Object.values(selectedBuildVariantTasks[name]).filter((v) => v).length
      : 0,
  }));

const getPatchTriggerAliasEntries = (
  selectableAliases: PatchTriggerAlias[],
  selectedAliases: AliasState,
) => {
  if (!selectableAliases) {
    return [];
  }
  return selectableAliases.map(
    ({ alias, childProjectIdentifier, variantsTasks }) => ({
      displayName: `${alias} (${childProjectIdentifier})`,
      name: alias,
      taskCount: selectedAliases[alias]
        ? variantsTasks.reduce((count, { tasks }) => count + tasks.length, 0)
        : 0,
    }),
  );
};

const getChildPatchEntries = (childPatches: ChildPatchAliased[]) => {
  if (!childPatches) {
    return [];
  }
  return childPatches.map(({ alias, projectIdentifier, variantsTasks }) => ({
    displayName: `${alias} (${projectIdentifier})`,
    name: alias,
    taskCount: variantsTasks.reduce((c, v) => c + v.tasks.length, 0),
  }));
};

const toGQLVariantTasksType = (
  selectedVariantTasks: VariantTasksState,
): VariantTasks[] =>
  Object.entries(selectedVariantTasks)
    .map(([variantName, tasksObj]) => {
      const tasksArr = Object.entries(tasksObj)
        .filter((entry) => entry[1])
        .map((entry) => entry[0]);
      return {
        variant: variantName,
        tasks: tasksArr,
        displayTasks: [],
      };
    })
    .filter(({ tasks }) => tasks.length);

const toGQLAliasType = (selectedAliases: AliasState) =>
  Object.entries(selectedAliases)
    .filter(([, isSelected]) => isSelected)
    .map(([alias]) => alias);

// Remove all patch trigger aliases that have already been invoked as child patches via CLI
const filterAliases = (
  patchTriggerAliases: PatchTriggerAlias[],
  childPatchAliases: ChildPatchAlias[],
): PatchTriggerAlias[] => {
  const invokedAliases = new Set(childPatchAliases.map(({ alias }) => alias));
  return patchTriggerAliases.filter(({ alias }) => !invokedAliases.has(alias));
};

const StyledInput = styled(TextInput)`
  font-weight: bold;
  font-size: ${fontSize.m};
  margin-bottom: ${size.s};
  width: 100%;
`;

const ButtonWrapper = styled.div`
  margin-top: ${size.m};
  display: flex;
  gap: ${size.s};
  white-space: nowrap;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${size.s};
`;

const BannerContainer = styled.div`
  margin-bottom: ${size.s};
`;

export default ConfigurePatchCore;
