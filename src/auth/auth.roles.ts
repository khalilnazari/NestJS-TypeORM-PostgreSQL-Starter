export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export const AccessScope = {
  // only admin and config role can access to admin routes
  admin: [UserRole.ADMIN],

  // every role can access to user route
  user: [UserRole.ADMIN, UserRole.USER],
};
