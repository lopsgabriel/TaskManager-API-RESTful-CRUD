/* eslint-disable prettier/prettier */
import { Body, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/models/user.model';
import { UserSchema } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>, // Repositório para a entidade UserModel
  ) {}

  // Método para criar um novo usuário
  async createUser(userData: UserSchema): Promise<UserModel> {
    const newUser = this.userRepository.create(userData); // Cria uma nova instância do usuário com os dados fornecidos
    return await this.userRepository.save(newUser); // Salva o novo usuário no banco de dados e retorna o usuário salvo
  }

  // Método para obter todos os usuários
  async getAllUser(): Promise<UserModel[]> {
    const users = this.userRepository.find(); // Busca todos os usuários

    // Verifica se não há usuários registrados
    if ((await users).length == 0) {
      console.log('Nenhum usuário registrado.');
    }

    return await users; // Retorna todos os usuários
  }

  // Método para obter um usuário específico pelo ID
  async getOneUser(@Param('id') id: string): Promise<UserModel> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`Não existe usuário com id ${id}`); // Erro se o usuário não for encontrado
    }
    return user; // Retorna o usuário encontrado
  }

  // Método para obter um usuário específico pelo nome de usuário
  async getOneUserByUsername(
    @Param('username') username: string,
  ): Promise<UserModel> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error(`Não existe usuário com nome ${username}`); // Erro se o usuário não for encontrado
    }
    return user; // Retorna o usuário encontrado
  }

  // Método para obter um usuário específico pelo e-mail
  async getOneUserByEmail(@Param('email') email: string): Promise<UserModel> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error(`Não existe usuário com email ${email}`); // Erro se o usuário não for encontrado
    }
    return user; // Retorna o usuário encontrado
  }

  // Método para atualizar um usuário específico pelo ID
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UserSchema,
  ): Promise<UserModel> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('Usuário não encontrado'); // Erro se o usuário não for encontrado
    }

    // Atualiza o usuário com os novos dados
    await this.userRepository.update({ id }, userData);

    return await this.userRepository.findOne({ where: { id } }); // Retorna o usuário atualizado
  }

  // Método para deletar um usuário específico pelo ID
  async deleteUser(@Param('id') id: string): Promise<string | void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('não foi possivel deletar o usuario'); // Erro se o usuário não for encontrado
    }

    // Deleta o usuário do banco de dados
    await this.userRepository.delete(id);
    return 'Usuário deletado'; // Retorna mensagem de sucesso
  }
}
