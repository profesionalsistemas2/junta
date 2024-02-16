import { PartialType } from '@nestjs/mapped-types';
import { CreateParametrosDto } from './create-parameter.dto';

export class UpdateParametrosDto extends PartialType(CreateParametrosDto) {}
