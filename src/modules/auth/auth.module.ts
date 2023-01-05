// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { UsersModule } from '../users/users.module';
// import { AuthService } from './auth.service';
// import { jwtConstants } from 'src/constants';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Users } from '../users/entities/user.entity';
// import { UsersController } from '../users/users.controller';

// @Module({
//   imports: [
//     UsersModule,
//     PassportModule,
//     // TypeOrmModule.forFeature([Users]),
//     JwtModule.register({
//       secret: jwtConstants.secret,
//       signOptions: { expiresIn: '60s' },
//     }),
//   ],
//   controllers: [UsersController],
//   providers: [AuthService, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}
