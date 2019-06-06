import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as gravatar from 'gravatar';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';

import { JwtStrategy } from '../auth/jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ModelType<User> & typeof User,
    @Inject(forwardRef(() => JwtStrategy))
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { email } = createUserDto;
      const user = await this.userModel.findOne({ email });
      if (user) {
        return new BadRequestException('email already exists').message;
      } else {
        const avatar = gravatar.url(email, {
          size: '200',
          rating: 'pg',
          default: 'mm',
        });
        const result = await this.userModel.create({
          ...createUserDto,
          avatar,
        });
        if (result.email) {
          const { user, token } = await this.jwtStrategy.validate({
            email: result.email,
          });
          user.tokens = user.tokens.concat(token);
          await user.save();
          return user;
        } else {
          return result;
        }
      }
    } catch (error) {
      return new BadRequestException(error).message;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    try {
      const { email, password } = loginUserDto;
      const res = await this.userModel.findByCredentials(email, password);
      if (res.email) {
        const { user, token } = await this.jwtStrategy.validate({
          email: res.email,
        });
        user.tokens = user.tokens.concat(token);
        await user.save();
        return user;
      } else {
        console.log(`login failed`);
        return res;
      }
    } catch (error) {
      return new BadRequestException(error).message;
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return new UnauthorizedException('email not found').message;
      }
      return user;
    } catch (error) {
      console.error(error);
    }
  }
}
