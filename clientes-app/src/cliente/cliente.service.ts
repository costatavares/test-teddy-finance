/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginatedClientesResponseDto } from './dto/pag-clientes-response.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) {}
  async create(dto: CreateClienteDto): Promise<Cliente> {
    try {
      const cliente = this.clienteRepo.create({
        id: uuidv4(),
        ...dto,
      });
      return await this.clienteRepo.save(cliente);
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      throw new InternalServerErrorException({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedClientesResponseDto> {
    const [data, total] = await this.clienteRepo.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      order: { nome: 'ASC' },
    });
    return {
      data,
      total,
      page,
      perPage,
    };
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepo.findOneBy({ id });
    if (!cliente) throw new NotFoundException(`Cliente ${id} não encontrado`);
    return cliente;
  }

  async update(id: string, dto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    Object.assign(cliente, dto);
    if (dto.selecionado !== undefined) {
      dto.selecionado ? cliente.activated() : cliente.desactivated();
    }
    return this.clienteRepo.save(cliente);
  }

  async remove(id: string) {
    const result = await this.clienteRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente ${id} não encontrado`);
    }
    return { message: `Cliente ${id} removido com sucesso` };
  }
}
