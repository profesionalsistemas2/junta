import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Parametros extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  bienvenida: string;

  @Prop({ required: true })
  fondo_img: string;

  @Prop({ required: true })
  orden_dia: string;

  @Prop({ required: true })
  acta_nro: number;

  @Prop({ required: true })
  ruta_acta: string;

  @Prop({ required: true })
  ruta_financiera: string;

  @Prop({ required: true })
  convocatoria: string;

  @Prop({ required: true })
  fecha_estados: Date;
}

export const ParametrosSchema = SchemaFactory.createForClass(Parametros);
