import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Usuario extends Document {
  @Prop({ unique: true, index: true })
  usuario: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  actividad: Date;

  @Prop({ required: true })
  rol: string;

  @Prop({ required: true, default: true })
  estado: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
