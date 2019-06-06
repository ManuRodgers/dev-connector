import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: Request = context.switchToHttp().getRequest<Request>();
      const currentToken = req.header('Authorization');
      if (currentToken === undefined) {
        throw new Error('no token, Authorization denies');
      } else {
        const email = this.jwtService.verify(currentToken.split(' ')[1]).email;
        const currentUser = await this.userService.findOneByEmail(email);
        req.user = currentUser;
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
