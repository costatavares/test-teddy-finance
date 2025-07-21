// eslint-disable-next-line prettier/prettier
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column('decimal', { precision: 10, scale: 2 })
  salario: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'valor_empresa' })
  valorEmpresa: number;

  @Column({ default: false })
  selecionado: boolean;

  activated() {
    this.selecionado = true;
  }

  desactivated() {
    this.selecionado = false;
  }
}
