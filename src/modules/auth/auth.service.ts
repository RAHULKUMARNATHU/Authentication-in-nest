import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { forgetPasswordDto } from '../users/dto/forget-password';
import { jwtConstants } from 'src/constants';
import { resetPasswordDto } from '../users/dto/reset-password.dto';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  jwt = require('jsonwebtoken');
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
    const payload = {
      username: user.userName,
      userId: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgetPassword(body: forgetPasswordDto) {
    const user = await this.userService.findByUserName(body.userName);
    if (!user) {
      throw new NotFoundException('User Not Registered');
    }
    const secret = jwtConstants + user.password;
    const payload = {
      id: user.id,
      email: user.userName,
    };
    const token = this.jwt.sign(payload, secret, { expiresIn: '1d' });
    const link = `http://localhost:3000/auth/resetPassword/${user.id}/${token}`;
    console.log(link);
    // console.log(token);
    return user;
  }

  async setPassword(id: number, body: resetPasswordDto): Promise<string> {
    if (body.password === body.confirmPassword) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(body.password, salt);
      const updatePassword = await this.userService.updatePassword(id, hashPassword);

      if (updatePassword) {
        return 'Password Updated Successfully!!';
      } else {
        throw new HttpException(
          'Error While Updating Password',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('Password Not Matched', HttpStatus.BAD_REQUEST);
    }
  }
}
