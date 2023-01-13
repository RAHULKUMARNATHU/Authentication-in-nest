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
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';
import { forgetPasswordDto } from './dto/forget-password';
import { resetPasswordDto } from './dto/reset-password.dto';
import { jwtConstants } from 'src/constants';



@ApiTags('Auth- Module')
@Controller('auth')
export class UsersController {
   jwt = require('jsonwebtoken')
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Create  data from this Api' })
  @ApiResponse({
    status: 201,
    description: 'Created ',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'Nathu',
          description: "user's first Name",
        },
        lastName: {
          type: 'string',
          example: 'Kumar',
          description: "user's last Name",
        },
        userName: {
          type: 'email',
          example: 'nathu@gmail.com',
          description: 'username it must be unique',
        },
        password: {
          type: 'string',
          example: 'password@123',
          description: 'password contains uppercase , lowercase , number',
        },

        role: {
          type: 'enum',
          example: 'user',
          description: 'role  to user , admin , sysadmin ',
        },
      },
    },
  })
  @Post('/create')
  create(@Body() body: CreateUserDto) {
    try {
      return this.authService.createUser(body);
    } catch (err) {
      throw new BadRequestException('Error');
    }
  }

  @ApiOperation({ summary: 'login from this Api' })
  @Post('/login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body.userName, body.password);
  }

  @ApiOperation({ summary: 'Get all data from this Api' })
  @ApiResponse({
    status: 200,
    description: 'All Data list',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server error ',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOneBy(+id);
  // }

  @ApiOperation({ summary: 'update  data from this Api' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique Id ',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'Nathu',
          description: "user's first Name",
        },
        lastName: {
          type: 'string',
          example: 'Kumar',
          description: "user's last Name",
        },
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth('JWT')
  // @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'This is the User Info ' })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // @Post('/forgetPassword')
  // async forgetPassword(@Res() res: Response) {
  //   const data = await this.authService.forgetPassword( );

  //   res.status(HttpStatus.OK).send({
  //     success: HttpStatus.OK,
  //     message: 'forget Password link sent to mail',
  //     data,
  //   });
  // }




  @Post('/forget')
    async forgetPassword(@Res() res: Response,
        @Body() body: forgetPasswordDto
    ): Promise<void> {
        const user = await this.authService.forgetPassword(body);
        res.status(HttpStatus.OK).send({
            success: HttpStatus.OK,
            // user,
            message: `Password Reset Link Has Been Sent To Your Email:- ${user.userName} `,
        });
    }

    @Post('/resetPassword/:id/:token')
    async resetPassword(@Request() req,
        @Res() res: Response,
        @Body() body: resetPasswordDto) {

        const { id, token } = req.params;
        const user = await this.usersService.findOne(+id)
        if (user.userName) {
            const secret = jwtConstants + user.password;

            try {
                const payload = this.jwt.verify(token, secret);
                if (payload)
                    res.send(await this.authService.setPassword(req.params.id , body));
            } catch (err) {
                console.log(err.message);
                res.send(err);
            }
        } else {
            throw new UnauthorizedException('Invalid User')
        }
    }

  // @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/admin')
  async adminRoute(@Request() req) {
    return req.user;
    // return 'hello';
  }



  @Post("upload") // API path
  @UseInterceptors(
    FileInterceptor(
      "file", // name of the field being passed
      { storage }
    )
  )
  async upload(@UploadedFile() file) {
    return file;
  }

}
