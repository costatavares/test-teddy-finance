// eslint-disable-next-line prettier/prettier
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateClienteDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @IsNumber({}, { message: 'O salário deve ser um número' })
  @Min(0, { message: 'O salário deve ser no mínimo 0' })
  salario: number;

  @IsNumber({}, { message: 'O valor da empresa deve ser um número' })
  @Min(0, { message: 'O valor da empresa deve ser no mínimo 0' })
  valorEmpresa: number;

  // selecionado?: boolean; // Campo opcional para seleção
}
