import { User } from 'src/user/entities/user.entity';

export class PaginatedUserResponseDto {
  data: User[];
  total: number;
  page: number;
  perPage: number;
}
