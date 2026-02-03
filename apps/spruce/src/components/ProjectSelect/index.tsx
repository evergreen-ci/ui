import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import { useNavigate } from "react-router-dom";
import { Unpacked } from "@evg-ui/lib/types";
import SearchableDropdown from "components/SearchableDropdown";
import {
  ProjectsQuery,
  ProjectsQueryVariables,
  ViewableProjectRefsQuery,
  ViewableProjectRefsQueryVariables,
} from "gql/generated/types";
import { PROJECTS, VIEWABLE_PROJECTS } from "gql/queries";
import { ProjectOptionGroup } from "./ProjectOptionGroup";

interface ProjectSelectProps {
  className?: string;
  getProjectRoute: (projectIdentifier: string) => string;
  getRepoRoute?: (repoIdentifier: string) => string;
  isProjectSettingsPage?: boolean;
  onSubmit?: (projectIdentifier: string) => void;
  selectedProjectIdentifier: string;
  showLabel?: boolean;
}

export const ProjectSelect: React.FC<ProjectSelectProps> = ({
  className,
  getProjectRoute,
  getRepoRoute = () => "",
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
    return <Skeleton />;
  }

  const value =
    selectedProject?.displayName ||
    selectedProject?.identifier ||
    selectedProjectIdentifier;

  return (
    <SearchableDropdown
      className={className}
      data-cy="project-select"
      disabled={loading}
      label={showLabel ? "Project" : null}
      onChange={(projectIdentifier: any) => {
        onSubmit(projectIdentifier);
      }}
      optionRenderer={(projectGroup, onClick) => (
        <ProjectOptionGroup
          key={projectGroup.groupDisplayName}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          canClickOnRepoGroup={isProjectSettingsPage && projectGroup?.repo?.id}
          name={projectGroup.groupDisplayName}
          onClick={(identifier: string, isRepo: boolean) => {
            onClick(identifier);
            if (isRepo) {
              navigate(getRepoRoute(identifier));
            } else {
              navigate(getProjectRoute(identifier));
            }
          }}
          projects={projectGroup.projects}
          repoIdentifier={projectGroup?.repo?.id}
          value={value}
        />
      )}
      options={allProjects}
      searchFunc={handleSearch}
      searchPlaceholder="Search projects"
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      value={value}
      valuePlaceholder="Select a project"
    />
  );
};

const getFavoriteProjects = (projectGroups: ProjectsQuery["projects"]) =>
  projectGroups?.flatMap((g) => g.projects.filter((p) => p.isFavorite));

// Split a list of projects into two arrays, one of enabled projects and one of disabled projects
const filterDisabledProjects = (
  projects: Unpacked<
    ViewableProjectRefsQuery["viewableProjectRefs"]
  >["projects"],
) =>
  projects.reduce(
    ([enabled, disabled], project) =>
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      project.enabled === false
        ? [enabled, [...disabled, project]]
        : [[...enabled, project], disabled],
    [[], []],
  );

type ViewableProjectRef = Unpacked<
  ViewableProjectRefsQuery["viewableProjectRefs"]
>;
interface GetProjectsResult {
  groupDisplayName: ViewableProjectRef["groupDisplayName"];
  projects: ViewableProjectRef["projects"];
  repo?: ViewableProjectRef["repo"];
}
type GetProjectsType = (
  projectsData: ProjectsQuery,
  viewableProjectsData: ViewableProjectRefsQuery,
  isProjectSettingsPage: boolean,
) => GetProjectsResult[];

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

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const disabledProjects = [];
  const enabledProjectGroups = projectGroups.map((projectGroup) => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const [enabled, disabled] = filterDisabledProjects(projectGroup.projects);
    disabledProjects.push(...disabled);
    return {
      groupDisplayName: projectGroup.groupDisplayName,
      projects: enabled,
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
      ? // @ts-expect-error: FIXME. This comment was added by an automated script.
        [{ groupDisplayName: "Disabled Projects", projects: disabledProjects }]
      : []),
  ];
};
