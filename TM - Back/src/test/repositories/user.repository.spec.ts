/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskModel } from 'src/models/task.model';
import { UserModel } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';
import { Repository } from 'typeorm';

describe('UserRepository', () => {
  let repository: UserRepository;
  let userModelRepository: Repository<UserModel>;
  let taskModelRepository: Repository<TaskModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository, // Serviço a ser testado
        {
          provide: getRepositoryToken(UserModel), // Provedor do repositório de UserModel
          useClass: Repository, // Mock do repositório usando a classe Repository
        },
        {
          provide: getRepositoryToken(TaskModel), // Provedor do repositório de TaskModel
          useClass: Repository, // Mock do repositório usando a classe Repository
        },
      ],
    }).compile();

    // Obtém instâncias dos repositórios mockados e do serviço a ser testado
    repository = module.get<UserRepository>(UserRepository);
    userModelRepository = module.get<Repository<UserModel>>(
      getRepositoryToken(UserModel),
    );
    taskModelRepository = module.get<Repository<TaskModel>>(
      getRepositoryToken(TaskModel),
    );
  });

  it('Should be defined', () => {
    expect(repository).toBeDefined(); // Verifica se o repositório está definido
  });

  // Testes para o método createUser
  describe('createUser', () => {
    it('should create a user', async () => {
      const userData = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };

      const createdUser = {
        ...userData,
        id: 'some-uuid',
        tasks: [],
      };

      // Mockando o comportamento dos métodos create e save do repositório de UserModel
      jest
        .spyOn(userModelRepository, 'create')
        .mockReturnValue(createdUser as UserModel);
      jest
        .spyOn(userModelRepository, 'save')
        .mockResolvedValue(createdUser as UserModel);

      const result = await repository.createUser(userData);

      // Verifica se o usuário criado é igual ao usuário retornado
      expect(result).toEqual(createdUser);
      // Verifica se o método create foi chamado com os dados do usuário
      expect(userModelRepository.create).toHaveBeenCalledWith(userData);
      // Verifica se o método save foi chamado com o usuário criado
      expect(userModelRepository.save).toHaveBeenCalledWith(createdUser);
    });
  });

  // Testes para o método getAllUser
  describe('getAllUser', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: '1',
          username: 'Rafael',
          email: 'rafael@gmail.com',
          password: '12345',
          tasks: [],
        },
        {
          id: '2',
          username: 'Gabriel',
          email: 'gabriel@gmail.com',
          password: '123456',
          tasks: [],
        },
      ] as UserModel[];

      // Mockando o retorno do método find para retornar usuários
      jest.spyOn(userModelRepository, 'find').mockResolvedValue(users);

      const result = await repository.getAllUser();

      // Verifica se o resultado retornado é igual aos usuários mockados
      expect(result).toEqual(users);
      // Verifica se o método find foi chamado no repositório
      expect(userModelRepository.find).toHaveBeenCalled();
    });

    it('should log a message if no users are found', async () => {
      const users: UserModel[] = [];
      jest.spyOn(userModelRepository, 'find').mockResolvedValue(users);

      // Mockando o console.log para verificar se uma mensagem é registrada
      const consoleSpy = jest.spyOn(console, 'log');

      const result = await repository.getAllUser();

      // Verifica se o método find foi chamado e se a mensagem de log foi registrada
      expect(userModelRepository.find).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Nenhum usuário registrado.');
    });
  });

  // Testes para o método getOneUser
  describe('getOneUser', () => {
    it('should return one user', async () => {
      const userId = '1';
      const user: UserModel = {
        id: userId,
        username: 'gabriel',
        email: 'gabriel@gmail.com',
        password: '12345',
        tasks: [],
      };

      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(user);

      const result = await repository.getOneUser(userId);

      // Verifica se o usuário retornado é igual ao usuário mockado
      expect(result).toEqual(user);
    });

    it('should throw Error if user is not found', async () => {
      const userId = '1';
      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(undefined);

      // Verifica se a função getOneUser lança um erro se o usuário não for encontrado
      await expect(repository.getOneUser(userId)).rejects.toThrow(
        `Não existe usuário com id ${userId}`,
      );
    });
  });

  // Testes para o método getOneUserByUsername
  describe('getOneUserByUsername', () => {
    it('should return one user', async () => {
      const userName = 'gabriel';
      const user: UserModel = {
        id: '1',
        username: userName,
        email: 'gabriel@gmail.com',
        password: '12345',
        tasks: [],
      };

      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(user);

      const result = await repository.getOneUserByUsername(userName);

      // Verifica se o usuário retornado é igual ao usuário mockado
      expect(result).toEqual(user);
    });

    it('should throw Error if user is not found', async () => {
      const userName = 'gabriel';
      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(undefined);

      // Verifica se a função getOneUserByUsername lança um erro se o usuário não for encontrado
      await expect(repository.getOneUserByUsername(userName)).rejects.toThrow(
        `Não existe usuário com nome ${userName}`,
      );
    });
  });

  // Testes para o método getOneUserByEmail
  describe('getOneUserByEmail', () => {
    it('should return one user', async () => {
      const userEmail = 'gabriel@gmail.com';
      const user: UserModel = {
        id: '1',
        username: 'gabriel',
        email: userEmail,
        password: '12345',
        tasks: [],
      };

      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(user);

      const result = await repository.getOneUserByEmail(userEmail);

      // Verifica se o usuário retornado é igual ao usuário mockado
      expect(result).toEqual(user);
    });

    it('should throw an Error if user is not found', async () => {
      const userEmail = 'gabriel@gmail.com';
      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(undefined);

      // Verifica se a função getOneUserByEmail lança um erro se o usuário não for encontrado
      await expect(repository.getOneUserByEmail(userEmail)).rejects.toThrow(
        `Não existe usuário com email ${userEmail}`,
      );
    });
  });

  // Testes para o método updateUser
  describe('updateUser', () => {
    it('should update one user', async () => {
      const userId = '1';
      const updateUser = {
        username: 'rafael',
        email: 'rafael@gmail.com',
        password: '123456',
      };
      const user: UserModel = {
        id: userId,
        username: 'gabriel',
        email: 'gabriel@gmail.com',
        password: '12345',
        tasks: [],
      };

      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userModelRepository, 'update').mockResolvedValue(undefined);

      const result = await repository.updateUser(userId, updateUser);

      // Verifica se o usuário retornado é igual ao usuário mockado
      expect(result).toEqual(user);
    });

    it('should throw Error if user is not found', async () => {
      const userId = '1';
      const updateUser = {
        username: 'rafael',
        email: 'rafael@gmail.com',
        password: '123456',
      };

      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(undefined);

      // Verifica se a função updateUser lança um erro se o usuário não for encontrado
      await expect(repository.updateUser(userId, updateUser)).rejects.toThrow(
        'Usuário não encontrado',
      );
    });
  });

  // Testes para o método deleteUser
  describe('delete', () => {
    it('should delete one user', async () => {
      const userId = '1';
      const user: UserModel = {
        id: userId,
        username: 'gabriel',
        email: 'gabriel@gmail.com',
        password: '12345',
        tasks: [],
      };

      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userModelRepository, 'delete').mockResolvedValue(undefined);

      const result = await repository.deleteUser(userId);

      // Verifica se o resultado é a mensagem esperada de usuário deletado
      expect(result).toEqual(`Usuário deletado`);
    });

    it('should throw Error if user is no found', async () => {
      const userId = '1';
      jest.spyOn(userModelRepository, 'findOne').mockResolvedValue(undefined);

      // Verifica se a função deleteUser lança um erro se o usuário não for encontrado
      await expect(repository.deleteUser(userId)).rejects.toThrow(
        'não foi possivel deletar o usuario',
      );
    });
  });
});
