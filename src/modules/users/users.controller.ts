import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Request,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { RolesGuard } from '../auth/guards/role.guard';
// import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'src/constants/roles.enum';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/create')
  create(@Body() body: CreateUserDto) {

    try {
      return this.authService.createUser(body);
    } catch (err) {
      throw new BadRequestException('Error');
    }
  }

  @Post('/login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body.userName, body.password);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOneBy(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('/forgetPassword')
  async forgetPassword(@Res() res: Response) {
    const data = await this.authService.forgetPassword();

    res.status(HttpStatus.OK).send({
      success: HttpStatus.OK,
      message: 'forget Password link sent to mail',
      data,
    }); 
  }


  // @UseGuards(RolesGuard)
  @Roles(Role.USER , Role.ADMIN)
  @UseGuards(JwtAuthGuard ,RolesGuard)
  @Get('/admin')
  async adminRoute(@Request() req) {
    return req.user;
    // return 'hello';
  }
}
