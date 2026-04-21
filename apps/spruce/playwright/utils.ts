/**
 * Helper function to check if a GraphQL request has a specific operation name
 * @param postData - The GraphQL request post data
 * @param operationName - The operation name to check for
 * @returns True if the request has the specified operation name
 */
export function hasOperationName(
  postData: unknown,
  operationName: string,
): boolean {
  return (
    Object.prototype.hasOwnProperty.call(postData, "operationName") &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (postData as any).operationName === operationName
  );
}
