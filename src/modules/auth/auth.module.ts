// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { UsersModule } from '../users/users.module';
// import { AuthService } from './auth.service';
// import { jwtConstants } from 'src/constants';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Users } from '../users/entities/user.entity';
// import { UsersService } from '../users/users.service';

// @Module({
//   imports: [
//     UsersModule,
//     PassportModule,
//     // JwtModule.register({
//     //   secret: jwtConstants.secret,
//     //   signOptions: { expiresIn: '60s' },
//     // }),
//   ],
//   providers: [AuthService, JwtStrategy ],
//   exports: [AuthService],
// })
// export class AuthModule {}

// import { Module } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Users } from './entities/user.entity';
// import { AuthModule } from '../auth/auth.module';
// import { AuthService } from '../auth/auth.service';

// @Module({
//   imports: [TypeOrmModule.forFeature([Users]), AuthModule],
//   controllers: [UsersController],
//   providers: [UsersService , AuthService],
// })
// export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { UsersModule } from '../users/users.module';
// import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class AuthModule {}
