const paths = {
  evergreenLogs: "/evergreen",
  home: "/",
  login: "/login",
  resmokeLogs: "/resmoke",
  taskFile: "/taskFile",
  testLogs: "/test",
  upload: "/upload",
};

enum slugs {
  taskID = "taskId",
  execution = "execution",
  origin = "origin",
  testID = "testId",
  fileName = "fileName",
  groupID = "groupId",
}

const routes = {
  completeLogs: `${paths.resmokeLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.groupID}/all`,
  evergreenLogs: `${paths.evergreenLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.origin}`,
  login: paths.login,
  root: paths.home,
  taskFiles: `${paths.taskFile}/:${slugs.taskID}/:${slugs.execution}/:${slugs.fileName}`,
  testLogs: `${paths.testLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.testID}`,
  upload: paths.upload,
};

export { slugs };
export default routes;
