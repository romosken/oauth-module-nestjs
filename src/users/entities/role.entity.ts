import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";

@Entity({ name: "roles" })
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column()
  permissions: string[];
}
