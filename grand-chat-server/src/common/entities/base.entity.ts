import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Base<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}