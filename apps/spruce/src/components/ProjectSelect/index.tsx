import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import SearchableDropdown from "components/SearchableDropdown";
import {
  ProjectsQuery,
  ProjectsQueryVariables,
  ViewableProjectRefsQuery,
  ViewableProjectRefsQueryVariables,
} from "gql/generated/types";
import { PROJECTS, VIEWABLE_PROJECTS } from "gql/queries";
import { Unpacked } from "types/utils";
import { ProjectOptionGroup } from "./ProjectOptionGroup";

interface ProjectSelectProps {
  getRoute: (projectIdentifier: string) => string;
  isProjectSettingsPage?: boolean;
  onSubmit?: (projectIdentifier: string) => void;
  selectedProjectIdentifier: string;
  showLabel?: boolean;
}

export const ProjectSelect: React.FC<ProjectSelectProps> = ({
  getRoute,
  isProjectSettingsPage = false,
  onSubmit = () => {},
  selectedProjectIdentifier,
  showLabel = true,
}) => {
  const navigate = useNavigate();

  const { data: projectsData, loading: projectsLoading } = useQuery<
    ProjectsQuery,
    ProjectsQueryVariables
  >(PROJECTS, {
    skip: isProjectSettingsPage,
  });

  const { data: viewableProjectsData, loading: viewableProjectsLoading } =
    useQuery<ViewableProjectRefsQuery, ViewableProjectRefsQueryVariables>(
      VIEWABLE_PROJECTS,
      {
        skip: !isProjectSettingsPage,
      },
    );

  const loading = isProjectSettingsPage
    ? viewableProjectsLoading
    : projectsLoading;

  const allProjects = getProjects(
    // @ts-ignore: FIXME. This comment was added by an automated script.
    projectsData,
    viewableProjectsData,
    isProjectSettingsPage,
  );

  // Find the project with the selectedProjectIdentifier and set it as the selected project
  const selectedProject = useMemo(
    () =>
      allProjects
        .flatMap((g) => g.projects)
        .find((p) => p.identifier === selectedProjectIdentifier),
    [allProjects, selectedProjectIdentifier],
  );

  const handleSearch = (options: typeof allProjects, value: string) => {
    // iterate through options and remove any groups that have no matching projects
    const filteredProjects = options.reduce(
      (acc, g) => {
        const { groupDisplayName, projects: pg, repo } = g;

        const newProjects = pg.filter(
          // @ts-ignore: FIXME. This comment was added by an automated script.
          (p) =>
            groupDisplayName.toLowerCase().includes(value.toLowerCase()) ||
            p.displayName.toLowerCase().includes(value.toLowerCase()) ||
            p.identifier.toLowerCase().includes(value.toLowerCase()),
        );
        if (newProjects.length > 0) {
          acc.push({
            groupDisplayName,
            projects: newProjects,
            ...(repo && { repo }),
          });
        }
        return acc;
      },
      [] as typeof allProjects,
    );
    return filteredProjects;
  };

  if (allProjects.length === 0 || loading) {
    return null;
  }

  return (
    <SearchableDropdown
      label={showLabel ? "Project" : null}
      value={
        selectedProject?.displayName ||
        selectedProject?.identifier ||
        selectedProjectIdentifier
      }
      options={allProjects}
      onChange={(projectIdentifier: any) => {
        onSubmit(projectIdentifier);
        navigate(getRoute(projectIdentifier));
      }}
      optionRenderer={(projectGroup, onClick) => (
        <ProjectOptionGroup
          key={projectGroup.groupDisplayName}
          projects={projectGroup.projects}
          name={projectGroup.groupDisplayName}
          onClick={onClick}
          repoIdentifier={projectGroup?.repo?.id}
          canClickOnRepoGroup={isProjectSettingsPage && projectGroup?.repo?.id}
        />
      )}
      searchFunc={handleSearch}
      disabled={loading}
      valuePlaceholder="Select a project"
      data-cy="project-select"
    />
  );
};

const getFavoriteProjects = (projectGroups: ProjectsQuery["projects"]) =>
  // @ts-ignore: FIXME. This comment was added by an automated script.
  projectGroups?.flatMap((g) => g.projects.filter((p) => p.isFavorite));

// Split a list of projects into two arrays, one of enabled projects and one of disabled projects
const filterDisabledProjects = (
  projects: Unpacked<
    ViewableProjectRefsQuery["viewableProjectRefs"]
    // @ts-ignore: FIXME. This comment was added by an automated script.
  >["projects"],
) =>
  projects.reduce(
    // @ts-ignore: FIXME. This comment was added by an automated script.
    ([enabled, disabled], project) =>
      project.enabled === false
        ? [enabled, [...disabled, project]]
        : [[...enabled, project], disabled],
    [[], []],
  );

type ViewableProjectRef = Unpacked<
  ViewableProjectRefsQuery["viewableProjectRefs"]
>;
interface GetProjectsResult {
  // @ts-ignore: FIXME. This comment was added by an automated script.
  groupDisplayName: ViewableProjectRef["groupDisplayName"];
  // @ts-ignore: FIXME. This comment was added by an automated script.
  projects: ViewableProjectRef["projects"];
  // @ts-ignore: FIXME. This comment was added by an automated script.
  repo?: ViewableProjectRef["repo"];
}
type GetProjectsType = (
  projectsData: ProjectsQuery,
  viewableProjectsData: ViewableProjectRefsQuery,
  isProjectSettingsPage: boolean,
) => GetProjectsResult[];

// @ts-ignore: FIXME. This comment was added by an automated script.
const getProjects: GetProjectsType = (
  projectsData,
  viewableProjectsData,
  isProjectSettingsPage,
) => {
  if (!isProjectSettingsPage) {
    const projectGroups = projectsData?.projects ?? [];
    return [
      {
        groupDisplayName: "Favorites",
        projects: getFavoriteProjects(projectGroups),
      },
      ...projectGroups,
    ];
  }

  // For Project Settings pages, move disabled projects to the bottom of the dropdown
  const projectGroups = viewableProjectsData?.viewableProjectRefs ?? [];

  // @ts-ignore: FIXME. This comment was added by an automated script.
  const disabledProjects = [];
  const enabledProjectGroups = projectGroups.map((projectGroup) => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    const [enabled, disabled] = filterDisabledProjects(projectGroup.projects);
    disabledProjects.push(...disabled);
    return {
      // @ts-ignore: FIXME. This comment was added by an automated script.
      groupDisplayName: projectGroup.groupDisplayName,
      projects: enabled,
      // @ts-ignore: FIXME. This comment was added by an automated script.
      repo: projectGroup.repo,
    };
  });

  return [
    {
      groupDisplayName: "Favorites",
      projects: getFavoriteProjects(projectGroups),
    },
    ...enabledProjectGroups,
    ...(disabledProjects.length
      ? // @ts-ignore: FIXME. This comment was added by an automated script.
        [{ groupDisplayName: "Disabled Projects", projects: disabledProjects }]
      : []),
  ];
};
