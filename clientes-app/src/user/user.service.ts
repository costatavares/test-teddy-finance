/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedUserResponseDto } from 'src/cliente/dto/pag-users-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(dto: CreateUserDto) {
    try {
      const exists = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (exists) {
        throw new BadRequestException('E-mail já cadastrado');
      }

      const user = this.userRepo.create({
        id: uuidv4(),
        ...dto,
      });
      return await this.userRepo.save(user);
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedUserResponseDto> {
    const [data, total] = await this.userRepo.findAndCount({
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

  async findOne(id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`Usuário ${id} não encontrado`);
    return user;
  }

  async update(id: string, updateDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateDto);
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
    return { message: `Usuário ${id} removido com sucesso` };
  }
}
