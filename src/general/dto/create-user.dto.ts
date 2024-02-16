import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  usuario: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  actividad: string;

  @IsNotEmpty()
  @IsString()
  rol: string;

  @IsNotEmpty()
  estado?: string;

  createdAt?: Date;
}
