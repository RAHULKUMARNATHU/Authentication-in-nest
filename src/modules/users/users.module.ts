// import { Module } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Users } from './entities/user.entity';
// import { AuthModule } from '../auth/auth.module';
// import { AuthService } from '../auth/auth.service';

// @Module({
//   // imports: [AuthModule],
//   controllers: [UsersController],
//   providers: [UsersService ],
// })
// export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';



@Module({
  imports: [ 
    PassportModule,
    // TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),

    TypeOrmModule.forFeature([Users]),
  ],  


  controllers:[UsersController],
  providers: [UsersService , AuthService , JwtStrategy],
  exports:[UsersService]
})
export class UsersModule {}
