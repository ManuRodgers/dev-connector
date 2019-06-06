import { Module } from '@nestjs/common';
import { resolve } from 'path';

import { EnvConfigService } from './env.config.service';

@Module({
  providers: [
    {
      provide: EnvConfigService,
      useValue: new EnvConfigService(
        resolve(__dirname, '../../config/dev.env'),
      ),
    },
  ],
  exports: [EnvConfigService],
})
export class ConfigModule {}
