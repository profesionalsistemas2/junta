import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Historico extends Document {

  @Prop({ required: true })
  acta_nro: number;

  @Prop({ required: true })
  ruta_acta: string;

  @Prop({ required: true })
  fecha_financiera: Date;

  @Prop({ required: true })
  ruta_financiera: string;
}

export const HistoricoSchema = SchemaFactory.createForClass(Historico);
