import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export const Auth = (scopes: string[]) => {
  return applyDecorators(SetMetadata('scopes', scopes), UseGuards(AuthGuard));
};
