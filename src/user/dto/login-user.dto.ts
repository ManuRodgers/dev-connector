import { IsEmail, IsString, MinLength } from 'class-validator';

import { User } from '../user.model';

export class LoginUserDto {
  @IsString()
  @MinLength(6)
  readonly password: User['password'];

  @IsEmail()
  readonly email: User['email'];
}
