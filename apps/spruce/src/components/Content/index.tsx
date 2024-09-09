import { Route, Routes, Navigate } from "react-router-dom";
import {
  DistroSettingsRedirect,
  PatchRedirect,
  ProjectSettingsRedirect,
  UserPatchesRedirect,
  WaterfallCommitsRedirect,
} from "components/Redirects";
import {
  showImageVisibilityPage,
  showWaterfallPage,
} from "constants/featureFlags";
import { redirectRoutes, routes, slugs } from "constants/routes";
import { Commits } from "pages/Commits";
import { ConfigurePatch } from "pages/ConfigurePatch";
import { Container } from "pages/Container";
import { Distro } from "pages/Distro";
import { Host } from "pages/Host";
import { Hosts } from "pages/Hosts";
import { Image } from "pages/Image";
import { JobLogs } from "pages/JobLogs";
import { MyPatches } from "pages/MyPatches";
import { PageDoesNotExist } from "pages/NotFound";
import { Preferences } from "pages/Preferences";
import { ProjectPatches } from "pages/ProjectPatches";
import { ProjectSettings } from "pages/ProjectSettings";
import { Spawn } from "pages/Spawn";
import { Task } from "pages/Task";
import { TaskHistory } from "pages/TaskHistory";
import { TaskQueue } from "pages/TaskQueue";
import { UserPatches } from "pages/UserPatches";
import { VariantHistory } from "pages/VariantHistory";
import { VersionPage } from "pages/Version";
import { Waterfall } from "pages/Waterfall";
import { Layout } from "./Layout";

export const Content: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route element={<Navigate to={routes.myPatches} />} path="/" />
      <Route element={<Commits />} path={routes.commits}>
        <Route element={null} path={`:${slugs.projectIdentifier}`} />
      </Route>
      <Route element={<Container />} path={routes.container} />
      <Route
        element={<WaterfallCommitsRedirect />}
        path={redirectRoutes.waterfall}
      />
      <Route element={<ConfigurePatch />} path={routes.configurePatch}>
        <Route element={null} path={`:${slugs.tab}`} />
      </Route>
      <Route element={<Distro />} path={`${routes.distroSettings}/*`}>
        <Route element={null} path={`:${slugs.tab}`} />
      </Route>
      <Route
        element={<DistroSettingsRedirect />}
        path={redirectRoutes.distroSettings}
      />
      <Route element={<Host />} path={routes.host} />
      <Route element={<Hosts />} path={routes.hosts} />
      {showImageVisibilityPage && (
        <Route element={<Image />} path={`${routes.image}/*`}>
          <Route element={null} path={`:${slugs.tab}`} />
        </Route>
      )}
      <Route element={null} path={routes.jobLogs}>
        <Route element={<JobLogs isLogkeeper />} path={`:${slugs.buildId}`}>
          <Route element={null} path={`:${slugs.groupId}`} />
        </Route>
        <Route
          element={<JobLogs isLogkeeper={false} />}
          path={`:${slugs.taskId}/:${slugs.execution}/:${slugs.groupId}`}
        />
      </Route>
      <Route element={<MyPatches />} path={routes.myPatches} />
      <Route element={<PatchRedirect />} path={redirectRoutes.patch}>
        <Route element={null} path={`:${slugs.tab}`} />
      </Route>
      <Route element={<Preferences />} path={`${routes.preferences}/*`}>
        <Route element={null} path={`:${slugs.tab}`} />
      </Route>
      <Route element={<ProjectPatches />} path={routes.projectPatches} />
      <Route element={<ProjectSettings />} path={`${routes.projectSettings}/*`}>
        <Route element={null} path={`:${slugs.tab}`} />
      </Route>
      <Route
        element={<ProjectSettingsRedirect />}
        path={redirectRoutes.projectSettings}
      />
      <Route element={<Spawn />} path={`${routes.spawn}/*`}>
        <Route element={null} path={`:${slugs.tab}`} />
      </Route>
      <Route element={<Task />} path={routes.task}>
        <Route element={null} path={`:${slugs.tab}`} />
      </Route>
      <Route element={<TaskHistory />} path={routes.taskHistory} />
      <Route element={<TaskQueue />} path={routes.taskQueue}>
        <Route element={null} path={`:${slugs.distroId}`} />
      </Route>
      <Route element={<UserPatches />} path={routes.userPatches} />
      <Route
        element={<UserPatchesRedirect />}
        path={redirectRoutes.userPatches}
      />
      <Route element={<VariantHistory />} path={routes.variantHistory} />
      <Route element={<VersionPage />} path={routes.version}>
        <Route element={null} path={`:${slugs.tab}`} />
      </Route>
      {showWaterfallPage && (
        <Route element={<Waterfall />} path={routes.waterfall} />
      )}
      <Route element={<PageDoesNotExist />} path="*" />
    </Route>
  </Routes>
);
