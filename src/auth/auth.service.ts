import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { students, staff } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

export type UserType = 'student' | 'staff';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  type: UserType;
  studentId?: string;
  staffId?: string;
  role?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    // Try to find student first
    const [student] = await this.databaseService.db
      .select()
      .from(students)
      .where(and(eq(students.email, email), eq(students.isActive, true)))
      .limit(1);

    if (student) {
      const isPasswordValid = await bcrypt.compare(password, student.password);
      if (!isPasswordValid) {
        return null;
      }

      return {
        id: student.id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        type: 'student',
        studentId: student.studentId,
      };
    }

    // Try to find staff
    const [staffMember] = await this.databaseService.db
      .select()
      .from(staff)
      .where(and(eq(staff.email, email), eq(staff.isActive, true)))
      .limit(1);

    if (staffMember) {
      const isPasswordValid = await bcrypt.compare(
        password,
        staffMember.password,
      );
      if (!isPasswordValid) {
        return null;
      }

      return {
        id: staffMember.id,
        email: staffMember.email,
        firstName: staffMember.firstName,
        lastName: staffMember.lastName,
        type: 'staff',
        staffId: staffMember.staffId,
        role: staffMember.role,
      };
    }

    return null;
  }

  login(user: AuthUser) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: user.type,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        type: user.type,
        studentId: user.studentId,
        staffId: user.staffId,
        role: user.role,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
