/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserModel } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';
import { UserSchema } from 'src/schemas/user.schema';

@Controller('/user')
export class UserController {
  // Injetando a dependência do UserRepository no controlador
  constructor(private readonly userRepository: UserRepository) {}

  // Endpoint para criar um novo usuário
  @Post()
  async create(@Body() userData: UserSchema): Promise<UserModel> {
    try {
      // Chama o método createUser do repositório para criar um novo usuário com os dados fornecidos
      return await this.userRepository.createUser(userData);
    } catch (error) {
      // Tratamento de erro ao criar um usuário
      throw new Error('Erro ao criar usuário');
    }
  }

  // Endpoint para obter todos os usuários
  @Get()
  async getAll(): Promise<UserModel[]> {
    // Chama o método getAllUser do repositório para obter todos os usuários
    return await this.userRepository.getAllUser();
  }

  // Endpoint para obter um usuário específico pelo ID
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<UserModel> {
    try {
      // Chama o método getOneUser do repositório para obter um usuário específico pelo ID
      return await this.userRepository.getOneUser(id);
    } catch (error) {
      // Tratamento de erro ao buscar um usuário
      throw new Error('Erro ao achar usuario');
    }
  }

  // Endpoint para obter um usuário específico pelo nome de usuário
  @Get('/username/:username')
  async getOneByUsername(
    @Param('username') username: string,
  ): Promise<UserModel> {
    try {
      // Chama o método getOneUserByUsername do repositório para obter um usuário específico pelo nome de usuário
      return await this.userRepository.getOneUserByUsername(username);
    } catch (error) {
      // Tratamento de erro ao buscar um usuário
      throw new Error('Erro ao achar usuario');
    }
  }

  // Endpoint para obter um usuário específico pelo email
  @Get('/email/:email')
  async getOneByEmail(@Param('email') email: string): Promise<UserModel> {
    try {
      // Chama o método getOneUserByEmail do repositório para obter um usuário específico pelo email
      return await this.userRepository.getOneUserByEmail(email);
    } catch (error) {
      // Tratamento de erro ao buscar um usuário
      throw new Error('Erro ao achar usuario');
    }
  }

  // Endpoint para atualizar um usuário específico pelo ID
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UserSchema,
  ): Promise<UserModel> {
    try {
      // Chama o método updateUser do repositório para atualizar o usuário com os dados fornecidos
      return await this.userRepository.updateUser(id, userData);
    } catch (error) {
      // Tratamento de erro ao atualizar um usuário
      throw new Error('Erro ao atualizar usuario');
    }
  }

  // Endpoint para deletar um usuário específico pelo ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string | void> {
    // Chama o método deleteUser do repositório para deletar o usuário pelo ID
    return await this.userRepository.deleteUser(id);
  }
}
