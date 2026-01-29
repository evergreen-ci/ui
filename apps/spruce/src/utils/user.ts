/**
 * Returns the display name for a user, falling back to userId if displayName is not available.
 * @param user - The user object containing userId and optional displayName
 * @param user.displayName - The user's display name (optional)
 * @param user.userId - The user's unique identifier
 * @returns The user's display name if available, otherwise the userId
 */
export const getDisplayName = (user: {
  displayName?: string | null;
  userId: string;
}) => user.displayName || user.userId;
