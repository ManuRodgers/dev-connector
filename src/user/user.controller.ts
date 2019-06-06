import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { IResult } from '../interfaces/IResult';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('')
  async create(@Body() createUserDto: CreateUserDto): Promise<IResult<User>> {
    try {
      const result = await this.userService.create(createUserDto);
      if (result.email) {
        return {
          statusCode: HttpStatus.CREATED,
          message: 'create successfully',
          data: result,
        };
      } else {
        return { error: result };
      }
    } catch (error) {
      return new BadRequestException(error).message;
    }
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto): Promise<IResult<User>> {
    try {
      const res = await this.userService.login(loginUserDto);
      if (res.email) {
        return {
          statusCode: HttpStatus.OK,
          message: 'login successfully',
          data: res,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'login failed',
          error: res,
        };
      }
    } catch (error) {
      return new BadRequestException(error).message;
    }
  }
  @Get('')
  @UseGuards(AuthGuard)
  async getAllUsers(@Req() req: Request): Promise<User> {
    console.log(req.user);
    return req.user;
  }
}
