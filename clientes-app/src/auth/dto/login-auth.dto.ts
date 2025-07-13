/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class LoginAuthDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @MaxLength(32, { message: 'A senha não deve ter mais que 32 caracteres' })
  password: string;
}
