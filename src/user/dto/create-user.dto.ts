import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { User } from '../user.model';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: User['name'];

  @IsString()
  @MinLength(6)
  readonly password: User['password'];

  @IsEmail()
  readonly email: User['email'];

  @IsString()
  @IsOptional()
  readonly avatar: User['avatar'];
}
