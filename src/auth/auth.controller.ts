import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  login(
    @CurrentUser()
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      type: 'student' | 'staff';
      studentId?: string;
      staffId?: string;
      role?: string;
    },
  ) {
    return this.authService.login(user);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getProfile(
    @CurrentUser()
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
    },
  ) {
    return user;
  }
}
