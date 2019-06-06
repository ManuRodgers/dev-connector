import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { IJwtPayload } from './interfaces/IJwtPayload';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(payload: IJwtPayload): Promise<string> {
    try {
      return this.jwtService.sign(payload);
    } catch (error) {
      console.error(error);
    }
  }

  async validateUser(payload: IJwtPayload): Promise<User> {
    // put some validation logic here
    // for example query user by id/email/username
    try {
      return this.userService.findOneByEmail(payload.email);
    } catch (error) {
      console.error(error);
    }
  }
}
