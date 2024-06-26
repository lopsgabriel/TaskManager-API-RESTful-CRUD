import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { TaskModel } from 'src/models/task.model';
import { UserModel } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, TaskModel])],
  providers: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
