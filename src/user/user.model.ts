import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  arrayProp,
  InstanceType,
  ModelType,
  pre,
  prop,
  staticMethod,
  Typegoose,
} from 'typegoose';

@pre<User>('save', async function(next) {
  // this means the user instance for current operation
  // create or update
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
  }
  await next();
})
export class User extends Typegoose {
  @IsString()
  @IsNotEmpty()
  @prop({ required: true, trim: true })
  name: string;

  @IsString()
  @prop({
    required: true,
    trim: true,
    minlength: 6,
  })
  password: string;

  @IsEmail()
  @prop({ required: true, trim: true, unique: true, lowercase: true })
  email: string;

  @IsString()
  @IsOptional()
  @prop({})
  avatar: string;

  @IsString()
  @arrayProp({
    items: String,
    required: false,
  })
  tokens?: string[];

  @staticMethod
  static async findByCredentials(
    this: ModelType<User> & typeof User,
    email: string,
    password: string,
  ): Promise<InstanceType<User>> {
    const loggingUser = await this.findOne({ email });
    if (!loggingUser) {
      return new UnauthorizedException('Invalid Credentials').message;
    }
    const isMatch = await bcrypt.compare(password, loggingUser.password);
    if (!isMatch) {
      return new UnauthorizedException('Invalid Credentials').message;
    }
    return loggingUser;
  }
}
