import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParametrosDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  bienvenida: string;

  @IsNotEmpty()
  @IsString()
  fondo_img: string;

  @IsNotEmpty()
  @IsString()
  orden_dia: string;

  @IsNotEmpty()
  @IsNumber()
  acta_nro: number;

  @IsNotEmpty()
  @IsString()
  ruta_acta: string;

  @IsNotEmpty()
  @IsString()
  ruta_financiera: string;

  @IsNotEmpty()
  @IsString()
  convocatoria: string;

  @IsNotEmpty()
  fecha_estados: string;
}
