import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserType {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  type: 'student' | 'staff';
  studentId?: string;
  staffId?: string;
  role?: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return request.user as CurrentUserType;
  },
);
