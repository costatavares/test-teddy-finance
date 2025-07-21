import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { IsBoolean } from 'class-validator';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @IsBoolean({ message: 'O campo selecionado deve ser um booleano' })
  selecionado?: boolean; // Campo opcional para seleção
}
