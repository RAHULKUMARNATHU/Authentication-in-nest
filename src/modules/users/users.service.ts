import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { forgetPasswordDto } from './dto/forget-password';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private repo: Repository<Users>) {}

  async create(body: CreateUserDto, hashPassword: string): Promise<Users> {
    const user = this.repo.create({ ...body, password: hashPassword });
    return this.repo.save(user);
  }

  findByUserName(userName: string) {
    return this.repo.findOneBy({ userName });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async updatePassword(id : number , data: string){
    return this.repo.createQueryBuilder()
    .update(Users)
    .set({password:data})
   //  .where("id = :id", { id: id })
    .execute();
 }

 update(id: number, updateUserDto: UpdateUserDto) {
  return `This action updates a #${id} user`;
}

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
