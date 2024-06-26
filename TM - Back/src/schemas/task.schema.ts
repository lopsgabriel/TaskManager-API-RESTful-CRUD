/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Classe que define o esquema de validação para dados de tarefa
export class TaskSchema {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsString()
  status: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
