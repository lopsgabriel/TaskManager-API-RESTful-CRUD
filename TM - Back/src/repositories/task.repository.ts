/* eslint-disable prettier/prettier */
import { Body, Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskModel } from 'src/models/task.model';
import { UserModel } from 'src/models/user.model';
import { TaskSchema } from 'src/schemas/task.schema';
import { Repository } from 'typeorm';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(TaskModel)
    private readonly taskRepository: Repository<TaskModel>, // Repositório para a entidade TaskModel
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>, // Repositório para a entidade UserModel
  ) {}

  // Método para criar uma nova tarefa
  async createTask(taskData: TaskSchema): Promise<TaskModel> {
    // Busca o usuário associado à tarefa pelo ID do usuário
    const user = await this.userRepository.findOne({
      where: { id: taskData.userId },
    });

    // Verifica se o usuário foi encontrado
    if (!user) {
      throw new Error('User not found');
    }

    // Cria uma nova tarefa com os dados fornecidos
    const newTask = this.taskRepository.create({
      title: taskData.title,
      description: taskData.description,
      observation: taskData.observation,
      status: taskData.status,
      user: user, // Associa a tarefa ao usuário encontrado
    });

    // Salva a nova tarefa no banco de dados
    return await this.taskRepository.save(newTask);
  }

  // Método para obter todas as tarefas
  async getAllTask(): Promise<TaskModel[]> {
    const tasks = this.taskRepository.find(); // Busca todas as tarefas

    // Verifica se não há tarefas registradas
    if ((await tasks).length == 0) {
      console.log('Nenhuma tarefa registrada.');
    }
    return await tasks; // Retorna todas as tarefas
  }

  // Método para obter uma tarefa específica pelo ID
  async getOneTask(@Param('id', ParseIntPipe) id: number): Promise<TaskModel> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error(`Erro ao exibir tarefa com id ${id}`); // Erro se a tarefa não for encontrada
    }
    return task; // Retorna a tarefa encontrada
  }

  // Método para obter todas as tarefas de um usuário específico pelo ID do usuário
  async getTasksByUser(@Param('id') id: string): Promise<TaskModel[]> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      console.log('Usuario não encontrado'); // Mensagem se o usuário não for encontrado
      return [];
    }

    const tasks = await this.taskRepository.find({ where: { user } });
    if (tasks.length === 0) {
      console.log('Nenhuma tarefa foi encontrada'); // Mensagem se nenhuma tarefa for encontrada
    }
    return tasks; // Retorna as tarefas encontradas
  }

  // Método para atualizar uma tarefa específica pelo ID
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskData: TaskSchema,
  ): Promise<TaskModel> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new Error('Tarefa não encontrada'); // Erro se a tarefa não for encontrada
    }

    // Atualiza a tarefa com os novos dados
    await this.taskRepository.update({ id }, taskData);

    return await this.taskRepository.findOne({ where: { id } }); // Retorna a tarefa atualizada
  }

  // Método para deletar uma tarefa específica pelo ID
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Não foi possível encontrar a tarefa'); // Erro se a tarefa não for encontrada
    }

    // Deleta a tarefa do banco de dados
    await this.taskRepository.delete(id);
    return 'Tarefa deletada'; // Retorna mensagem de sucesso
  }
}
