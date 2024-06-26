/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserModel } from './user.model';

@Entity()
export class TaskModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: null })
  observation: string;

  @Column({ default: 'Pendente' })
  status: string;

  @ManyToOne(() => UserModel, (user) => user.tasks, {
    onDelete: 'CASCADE',
  })
  user: UserModel;
}
