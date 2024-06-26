/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Classe que define o esquema de validação para dados de usuário
export class UserSchema {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
