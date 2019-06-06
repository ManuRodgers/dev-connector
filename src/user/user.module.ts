import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    TypegooseModule.forFeature({
      typegooseClass: User,
      schemaOptions: {
        collection: 'users',
        timestamps: true,
      },
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
