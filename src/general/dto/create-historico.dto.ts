import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistoricoDto {

  @IsNotEmpty()
  @IsString()
  acta_nro: number;

  @IsNotEmpty()
  @IsString()
  ruta_acta: string;

  @IsNotEmpty()
  @IsString()
  fecha_financiera: Date;

  @IsNotEmpty()
  @IsString()
  ruta_financiera: string;


}
