/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskModel } from 'src/models/task.model';
import { UserModel } from 'src/models/user.model';
import { TaskRepository } from 'src/repositories/task.repository';
import { TaskSchema } from 'src/schemas/task.schema';
import { Repository } from 'typeorm';

describe('TaskRepository', () => {
  let repository: TaskRepository;
  let taskModelRepository: Repository<TaskModel>;
  let userModelRepository: Repository<UserModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getRepositoryToken(TaskModel),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserModel),
          useClass: Repository,
        },
      ],
    }).compile();

    // Obtém instâncias dos repositórios mockados e do serviço a ser testado
    repository = module.get<TaskRepository>(TaskRepository);
    taskModelRepository = module.get<Repository<TaskModel>>(
      getRepositoryToken(TaskModel),
    );
    userModelRepository = module.get<Repository<UserModel>>(
      getRepositoryToken(UserModel),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // Testes para o método createTask
  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Nova Tarefa',
        description: 'Descrição da tarefa',
        observation: 'Observação da tarefa',
        status: 'Pendente',
        userId: '1',
      };

      const user: UserModel = {
        id: '1',
        username: 'usuario',
        email: 'usuario@example.com',
        password: 'senha',
        tasks: [],
      };

      const createdTask = { id: 1, ...taskData, user };

      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(taskModelRepository, 'create').mockReturnValue(createdTask);
      jest.spyOn(taskModelRepository, 'save').mockResolvedValue(createdTask);

      const result = await repository.createTask(taskData);

      expect(result).toEqual(createdTask);
    });
  });

  // Testes para o método getAllTask
  describe('getAllTask', () => {
    it('should return all tasks', async () => {
      const tasks: TaskModel[] = [
        {
          id: 1,
          title: 'Tarefa 1',
          description: 'Descrição 1',
          observation: 'Observação 1',
          status: 'Pendente',
          user: null,
        },
        {
          id: 2,
          title: 'Tarefa 2',
          description: 'Descrição 2',
          observation: 'Observação 2',
          status: 'Concluído',
          user: null,
        },
      ];

      jest.spyOn(taskModelRepository, 'find').mockResolvedValue(tasks);

      const result = await repository.getAllTask();

      expect(result).toEqual(tasks);
    });
  });

  // Testes para o método getOneTask
  describe('getOneTask', () => {
    it('should return a task by ID', async () => {
      const taskId = 1;
      const task: TaskModel = {
        id: taskId,
        title: 'Tarefa',
        description: 'Descrição',
        observation: 'Observação',
        status: 'Pendente',
        user: null,
      };

      jest.spyOn(taskModelRepository, 'findOne').mockResolvedValue(task);

      const result = await repository.getOneTask(taskId);

      expect(result).toEqual(task);
    });

    it('should throw an error if task is not found', async () => {
      const taskId = 1;

      jest.spyOn(taskModelRepository, 'findOne').mockResolvedValue(undefined);

      await expect(repository.getOneTask(taskId)).rejects.toThrow(
        `Erro ao exibir tarefa com id ${taskId}`,
      );
    });
  });

  // Testes para o método getTasksByUser
  describe('getTasksByUser', () => {
    it('should return tasks for a user', async () => {
      const userId = '1';
      const user: UserModel = {
        id: userId,
        username: 'usuario',
        email: 'usuario@example.com',
        password: 'senha',
        tasks: [],
      };
      const tasks: TaskModel[] = [
        {
          id: 1,
          title: 'Tarefa 1',
          description: 'Descrição 1',
          observation: 'Observação 1',
          status: 'Pendente',
          user,
        },
        {
          id: 2,
          title: 'Tarefa 2',
          description: 'Descrição 2',
          observation: 'Observação 2',
          status: 'Concluído',
          user,
        },
      ];

      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(taskModelRepository, 'find').mockResolvedValue(tasks);

      const result = await repository.getTasksByUser(userId);

      expect(result).toEqual(tasks);
    });
  });

  // Testes para o método updateTask
  describe('updateTask', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const taskData: TaskSchema = {
        userId: '1',
        title: 'Updated Task Title',
        description: 'Updated Task Description',
        observation: 'Updated Task Observation',
        status: 'Updated Status',
      };
      const updatedTask: TaskModel = {
        id: taskId,
        title: 'Original Task Title',
        description: 'Original Task Description',
        observation: 'Original Task Observation',
        status: 'Original Status',
        user: {} as UserModel, // Exemplo de usuário
      };

      jest.spyOn(taskModelRepository, 'findOne').mockResolvedValue(updatedTask);
      jest.spyOn(taskModelRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(taskModelRepository, 'findOne').mockResolvedValueOnce({ ...updatedTask, ...taskData });

      const result = await repository.updateTask(taskId, taskData);

      expect(result).toEqual(updatedTask);
    });

    it('should throw an error if task is not found', async () => {
      const taskId = 1;
      const taskData: TaskSchema = {
        userId: '1',
        title: 'Updated Task Title',
        description: 'Updated Task Description',
        observation: 'Updated Task Observation',
        status: 'Updated Status',
      };

      jest.spyOn(taskModelRepository, 'findOne').mockResolvedValue(undefined);

      await expect(repository.updateTask(taskId, taskData)).rejects.toThrow('Tarefa não encontrada');
    });
  });

  // Testes para o método deleteTask
  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = 1;
      const user: UserModel = { id: "1", username: 'testuser', email: 'test@example.com', password: 'password', tasks: [] }; // Exemplo de usuário
      const task: TaskModel = {
        id: taskId,
        title: 'Sample Task',
        description: 'Sample Description',
        observation: 'Sample Observation',
        status: 'Pending',
        user: user, // Incluir o usuário na tarefa
      };

      jest.spyOn(taskModelRepository, 'findOne').mockResolvedValue(task);
      jest.spyOn(taskModelRepository, 'delete').mockResolvedValue({} as any);

      const result = await repository.deleteTask(taskId);

      expect(result).toEqual('Tarefa deletada');
    });

    it('should throw an error if task is not found', async () => {
      const taskId = 1;

      jest.spyOn(taskModelRepository, 'findOne').mockResolvedValue(null);

      await expect(repository.deleteTask(taskId)).rejects.toThrow('Não foi possível encontrar a tarefa');
    });
  });
  
});
