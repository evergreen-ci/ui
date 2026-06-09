/**
 * Checks if there are any changes in a specific directory
 * @param {string} directory - The directory to check for changes
 * @returns {boolean} True if there are changes in the specified directory
 */
export const hasChangesInDirectoryOrFile = (directoryOrFile) => {
  const changes = whatChanged();
  return changes.some(file => file.startsWith(directoryOrFile));
}; 
