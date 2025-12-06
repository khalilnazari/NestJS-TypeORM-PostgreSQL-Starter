import { UserRole } from 'src/user/entities/user.entity';

export const AccessScope = {
  // only admin and config role can access to admin routes
  admin: [UserRole.ADMIN],

  // every role can access to user route
  user: [UserRole.ADMIN, UserRole.USER],
};
