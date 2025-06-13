interface User {
  id?: string;
  [key: string]: unknown;
}

/**
 * Attempts to find a valid user ID from various possible properties
 */
export const getUserId = (user: User | null | undefined): string | null => {
  if (!user) return null;

  // Primary ID field
  if (user.id) return String(user.id);

  // Alternative ID fields
  const possibleIdFields = ["_id", "userId", "uid", "userID"];

  for (const field of possibleIdFields) {
    const userRecord = user as Record<string, unknown>;
    if (userRecord[field]) {
      console.log(
        `Found alternative ID field: ${field} with value: ${String(
          userRecord[field]
        )}`
      );
      return String(userRecord[field]);
    }
  }

  return null;
};

/**
 * Validates if a user has a valid ID
 */
export const validateUserSession = (
  user: User | null | undefined
): { isValid: boolean; errorMessage?: string } => {
  if (!user) {
    return {
      isValid: false,
      errorMessage: "Debes iniciar sesión para solicitar un duelo",
    };
  }

  const userId = getUserId(user);
  if (!userId) {
    return {
      isValid: false,
      errorMessage:
        "Tu sesión existe pero falta el ID de usuario. Intenta cerrar sesión y volver a iniciar.",
    };
  }

  return { isValid: true };
};
