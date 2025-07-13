import { Cliente } from '../entities/cliente.entity';

export class PaginatedClientesResponseDto {
  data: Cliente[];
  total: number;
  page: number;
  perPage: number;
}
