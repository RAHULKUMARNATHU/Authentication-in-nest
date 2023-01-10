import { IsEnum } from 'class-validator';
import { Role } from 'src/constants/roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 30,
  })
  firstName: string;

  @Column('varchar', { length: 20, name: 'last_name' })
  lastName: string;

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 50,
  })
  userName: string;

  @Column({
    name: 'password',
    type: 'varchar',
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role,
  })
  role: Role;
}
