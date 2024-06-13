import type { GroupedFiles } from "./types";

/**
 * `filterGroupedFiles` filters the groupedFiles array from the TaskFilesQuery
 * @param groupedFiles - the groupedFiles array from the TaskFilesQuery
 * @param search - the search string
 * @returns - a new array of groupedFiles that contain the search string
 */
const filterGroupedFiles = (groupedFiles: GroupedFiles[], search: RegExp) =>
  groupedFiles.reduce((acc, groupedFile) => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const filteredFiles = groupedFile?.files?.filter((file) =>
      search.test(file.name),
    );
    if (filteredFiles?.length) {
      acc.push({
        ...groupedFile,
        files: filteredFiles,
      });
    }
    return acc;
  }, [] as GroupedFiles[]);

export { filterGroupedFiles };
