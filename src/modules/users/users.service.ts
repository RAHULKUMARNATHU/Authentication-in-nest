import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private repo: Repository<Users>) {}
  
  
  async create(
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
  ): Promise<Users> {
    const user = this.repo.create({ firstName, lastName, userName, password });
    return this.repo.save(user);
  }

  findByUserName(userName: string) {
    return this.repo.findOneBy({ userName });
  }

  findAll() {
    return `This action returns all users`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
