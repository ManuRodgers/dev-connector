import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvConfigService } from '../config/env.config.service';
import { AuthService } from './auth.service';
import { IJwtPayload } from './interfaces/IJwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly envConfigService: EnvConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envConfigService.getValue('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload): Promise<any> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.authService.createToken(payload);
    // this return value will be saved into req.user
    return { user, token };
  }
}
