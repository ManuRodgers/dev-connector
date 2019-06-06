import * as joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

export interface IEnvConfig {
  [key: string]: string;
}

@Injectable()
export class EnvConfigService {
  private readonly envConfig: IEnvConfig;
  constructor(envConfigPath: string) {
    const comingEnvConfig = dotenv.parse(readFileSync(envConfigPath));
    this.envConfig = EnvConfigService.validateEnvConfig(comingEnvConfig);
  }

  getValue(key: string): string {
    try {
      return this.envConfig[key];
    } catch (error) {
      console.error(error);
    }
  }

  static validateEnvConfig(envConfig: IEnvConfig): IEnvConfig {
    const envConfigSchema: joi.ObjectSchema = joi.object({
      NODE_ENV: joi
        .string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: joi.number().default(3000),
      JWT_SECRET: joi.string().required(),
      DEFAULT_STRATEGY: joi.string().required(),
      MONGODB_URI: joi.string().required(),
    });
    const { error, value: validatedEnvConfig } = joi.validate(
      envConfig,
      envConfigSchema,
    );
    if (error) {
      throw new Error(`Config validation error ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
