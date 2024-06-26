import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from 'src/controllers/task.controller';
import { TaskModel } from 'src/models/task.model';
import { TaskRepository } from 'src/repositories/task.repository';
import { UserModel } from 'src/models/user.model';


@Module({
  imports: [TypeOrmModule.forFeature([TaskModel, UserModel])],
  providers: [TaskRepository],
  controllers: [TaskController],
})
export class TaskModule {}
