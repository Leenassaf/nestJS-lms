import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      email: 'student@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      type: 'student',
      studentId: 'STU001',
    },
  })
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    type: 'student' | 'staff';
    studentId?: string;
    staffId?: string;
    role?: string;
  };
}
