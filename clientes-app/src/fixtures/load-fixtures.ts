/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/fixtures/load-fixtures.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ClienteService } from '../cliente/cliente.service';
import { UserService } from '../user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const clienteService = app.get(ClienteService);
  const userService = app.get(UserService);

  await clienteService.create({
    nome: 'Fixture Empresa 1',
    salario: 3500,
    valorEmpresa: 120000,
  });

  await clienteService.create({
    nome: 'Fixture  Empresa 2',
    salario: 2500,
    valorEmpresa: 80000,
  });

  await userService.create({
    nome: 'Admin User',
    email: 'admin@user.com',
    password: 'Senha2024@',
  });

  await app.close();
  console.log('Fixtures carregadas com sucesso');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
