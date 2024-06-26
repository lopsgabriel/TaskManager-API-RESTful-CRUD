import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { TaskModel } from './models/task.model';
import { UserModule } from './modules/user.module';
import { TaskModule } from './modules/task.module';

@Module({
  imports: [
    UserModule,
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 7879,
      username: 'postgres',
      password: '12345',
      database: 'taskManager',
      entities: [UserModel, TaskModel],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserModel, TaskModel]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
