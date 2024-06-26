/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TaskModel } from 'src/models/task.model';
import { TaskRepository } from 'src/repositories/task.repository';
import { TaskSchema } from 'src/schemas/task.schema';

@Controller('/task')
export class TaskController {
  // Injetando a dependência do TaskRepository no controlador
  constructor(private readonly taskRepository: TaskRepository) {}

  // Endpoint para criar uma nova tarefa
  @Post()
  async create(@Body() taskData: TaskSchema) {
    // Chama o método createTask do repositório para criar uma nova tarefa com os dados fornecidos
    return this.taskRepository.createTask(taskData);
  }

  // Endpoint para obter todas as tarefas
  @Get()
  async getAll(): Promise<TaskModel[]> {
    // Chama o método getAllTask do repositório para obter todas as tarefas
    return await this.taskRepository.getAllTask();
  }

  // Endpoint para obter uma tarefa específica pelo ID
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<TaskModel> {
    // Chama o método getOneTask do repositório para obter uma tarefa específica pelo ID
    return await this.taskRepository.getOneTask(id);
  }

  // Endpoint para obter todas as tarefas de um usuário específico pelo ID do usuário
  @Get('/user/:id')
  async getTasksByUser(@Param('id') id: string): Promise<TaskModel[]> {
    // Chama o método getTasksByUser do repositório para obter todas as tarefas de um usuário específico
    return await this.taskRepository.getTasksByUser(id);
  }

  // Endpoint para atualizar uma tarefa específica pelo ID
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskData: TaskSchema,
  ): Promise<TaskModel> {
    // Chama o método updateTask do repositório para atualizar a tarefa com os dados fornecidos
    return await this.taskRepository.updateTask(id, taskData);
  }

  // Endpoint para deletar uma tarefa específica pelo ID
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string | void> {
    // Chama o método deleteTask do repositório para deletar a tarefa pelo ID
    return await this.taskRepository.deleteTask(id);
  }
}
