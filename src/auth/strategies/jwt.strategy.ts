import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { students, staff } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    type: 'student' | 'staff';
  }) {
    if (payload.type === 'student') {
      const [student] = await this.databaseService.db
        .select()
        .from(students)
        .where(and(eq(students.id, payload.sub), eq(students.isActive, true)))
        .limit(1);

      if (!student) {
        throw new UnauthorizedException('Student not found');
      }

      return {
        id: student.id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        fullName: `${student.firstName} ${student.lastName}`,
        type: 'student' as const,
        studentId: student.studentId,
      };
    }

    if (payload.type === 'staff') {
      const [staffMember] = await this.databaseService.db
        .select()
        .from(staff)
        .where(and(eq(staff.id, payload.sub), eq(staff.isActive, true)))
        .limit(1);

      if (!staffMember) {
        throw new UnauthorizedException('Staff not found');
      }

      return {
        id: staffMember.id,
        email: staffMember.email,
        firstName: staffMember.firstName,
        lastName: staffMember.lastName,
        fullName: `${staffMember.firstName} ${staffMember.lastName}`,
        type: 'staff' as const,
        staffId: staffMember.staffId,
        role: staffMember.role,
      };
    }

    throw new UnauthorizedException('Invalid user type');
  }
}
