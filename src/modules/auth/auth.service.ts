import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(body: CreateUserDto) {
    const users = await this.userService.findByUserName(body.userName);
    if (users) {
      throw new BadRequestException('Sorry :)Already Email In Use ');
    }
    const saltOrRounds = await bcrypt.genSalt();
    const bcryptPassword = await bcrypt.hash(body.password, saltOrRounds);

    const user = await this.userService.create(body, bcryptPassword);
    return user;
  }

  async login(userName: string, password: string) {
    const user = await this.userService.findByUserName(userName);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const hash = await bcrypt.compare(password, user.password);
    if (!hash) {
      throw new BadRequestException('Bad Password');
    }
    // return user;
    const payload = { username: user.userName, userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgetPassword() {
    return 'nodemailer';
  }
}
