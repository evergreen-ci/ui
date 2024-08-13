import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import Button from "@leafygreen-ui/button";
import { Tab } from "@leafygreen-ui/tabs";
import TextInput from "@leafygreen-ui/text-input";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "components/Buttons";
import { CodeChanges } from "components/CodeChanges";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import {
  StyledRouterLink,
  PageContent,
  PageLayout,
  PageSider,
  StyledLink,
} from "components/styles";
import { StyledTabs } from "components/styles/StyledTabs";
import { getProjectPatchesRoute, getVersionRoute } from "constants/routes";
import { fontSize, size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  SchedulePatchMutation,
  PatchConfigure,
  SchedulePatchMutationVariables,
  VariantTasks,
  ChildPatchAlias,
  ConfigurePatchQuery,
  ProjectBuildVariant,
  VariantTask,
} from "gql/generated/types";
import { SCHEDULE_PATCH } from "gql/mutations";
import {
  AliasState,
  ChildPatchAliased,
  PatchTriggerAlias,
  VariantTasksState,
  useConfigurePatch,
} from "hooks/useConfigurePatch";
import { taskSchedulingLimitsDocumentationUrl } from "../../../constants/externalResources";
import { largeNumFinalizedTasksThreshold } from "../../../constants/task";
import { ConfigureBuildVariants } from "./ConfigureBuildVariants";
import ConfigureTasks from "./ConfigureTasks";
import { ParametersContent } from "./ParametersContent";

interface ConfigurePatchCoreProps {
  patch: ConfigurePatchQuery["patch"];
}
const ConfigurePatchCore: React.FC<ConfigurePatchCoreProps> = ({ patch }) => {
  const navigate = useNavigate();
  const dispatchToast = useToastContext();

  const {
    activated,
    author,
    childPatchAliases,
    childPatches,
    id,
    patchTriggerAliases,
    project,
    projectIdentifier,
    time,
    variantsTasks,
  } = patch;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { variants } = project;

  const childPatchesWithAliases: ChildPatchAliased[] =
    childPatches?.map((cp) => {
      const { alias = id } =
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        childPatchAliases.find(({ patchId }) => cp.id === patchId) || {};
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
      dispatchToast.success("Successfully scheduled the patch");
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      navigate(getVersionRoute(scheduledPatch.versionFull.id));
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

  const numEstimatedActivatedGeneratedTasks =
    getNumEstimatedActivatedGeneratedTasks(
      selectedBuildVariantTasks,
      initialPatch.variantsTasks,
      patch?.generatedTaskCounts ?? {},
    );

  return (
    <>
      <FlexRow>
        <StyledInput
          label="Patch Name"
          data-cy="patch-name-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            loading={loadingScheduledPatch}
            onClick={onClickSchedule}
            variant="primary"
          >
            Schedule
          </LoadingButton>
        </ButtonWrapper>
      </FlexRow>
      {numEstimatedActivatedGeneratedTasks >
        largeNumFinalizedTasksThreshold && (
        <BannerContainer>
          <Banner data-cy="disabled-webhook-banner" variant="warning">
            This is a large operation, expected to schedule{" "}
            {numEstimatedActivatedGeneratedTasks} tasks. Please confirm that
            this number of tasks is necessary before continuing. For more
            information, please refer to our{" "}
            <StyledLink href={taskSchedulingLimitsDocumentationUrl}>
              docs.
            </StyledLink>
          </Banner>
        </BannerContainer>
      )}
      <PageLayout hasSider>
        <PageSider>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <MetadataCard error={null}>
            <MetadataTitle>Patch Metadata</MetadataTitle>
            <MetadataItem>Submitted by: {author}</MetadataItem>
            {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
            <MetadataItem>Submitted at: {time.submittedAt}</MetadataItem>
            <MetadataItem>
              Project:{" "}
              <StyledRouterLink to={getProjectPatchesRoute(projectIdentifier)}>
                {projectIdentifier}
              </StyledRouterLink>
            </MetadataItem>
          </MetadataCard>
          <ConfigureBuildVariants
            variants={getVariantEntries(variants, selectedBuildVariantTasks)}
            aliases={[
              ...getPatchTriggerAliasEntries(
                selectableAliases,
                selectedAliases,
              ),
              ...getChildPatchEntries(childPatchesWithAliases),
            ]}
            selectedBuildVariants={selectedBuildVariants}
            setSelectedBuildVariants={setSelectedBuildVariants}
            disabled={disableBuildVariantSelect}
          />
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs
              selected={selectedTab}
              setSelected={setSelectedTab}
              aria-label="Configure Patch Tabs"
            >
              <Tab data-cy="tasks-tab" name="Configure">
                <ConfigureTasks
                  activated={activated}
                  childPatches={childPatchesWithAliases}
                  totalSelectedTaskCount={totalSelectedTaskCount}
                  aliasCount={aliasCount}
                  selectableAliases={selectableAliases}
                  selectedAliases={selectedAliases}
                  selectedBuildVariants={selectedBuildVariants}
                  selectedBuildVariantTasks={selectedBuildVariantTasks}
                  setSelectedAliases={setSelectedAliases}
                  setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
                  activatedVariants={variantsTasks}
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
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  return childPatches.map(({ alias, projectIdentifier, variantsTasks }) => ({
    displayName: `${alias} (${projectIdentifier})`,
    name: alias,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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

const getNumEstimatedActivatedGeneratedTasks = (
  selectedBuildVariantTasks: VariantTasksState,
  variantsTasks: Array<VariantTask>,
  generatedTaskCounts: { [key: string]: number },
): number => {
  const existingTasks = new Set<string>();
  let count = 0;

  variantsTasks.forEach((variantTask) => {
    const variant = variantTask.name;
    variantTask.tasks.forEach((task) => {
      existingTasks.add(`${variant}-${task}`);
    });
  });

  Object.keys(selectedBuildVariantTasks).forEach((variant) => {
    Object.keys(selectedBuildVariantTasks[variant]).forEach((task) => {
      if (
        selectedBuildVariantTasks[variant][task] &&
        !existingTasks.has(`${variant}-${task}`)
      ) {
        count += 1;
        if (generatedTaskCounts[`${variant}-${task}`]) {
          count += generatedTaskCounts[`${variant}-${task}`];
        }
      }
    });
  });
  return count;
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
