import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigModule } from '../config/config.module';
import { EnvConfigService } from '../config/env.config.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (envConfigService: EnvConfigService) => {
        return {
          defaultStrategy: envConfigService.getValue('DEFAULT_STRATEGY'),
        };
      },
      inject: [EnvConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (envConfigService: EnvConfigService) => ({
        secret: envConfigService.getValue(`JWT_SECRET`),
        signOptions: {
          expiresIn: 360000,
        },
      }),
      inject: [EnvConfigService],
    }),
    forwardRef(() => UserModule),
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
