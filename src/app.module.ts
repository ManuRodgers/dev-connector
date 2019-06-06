import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypegooseModule } from 'nestjs-typegoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { EnvConfigService } from './config/env.config.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (envConfigService: EnvConfigService) => ({
        uri: envConfigService.getValue(`MONGODB_URI`),
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
      inject: [EnvConfigService],
    }),
    ConfigModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
