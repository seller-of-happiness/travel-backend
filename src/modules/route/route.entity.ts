import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { PointEntity } from "../point/point.entity";
import { Photo } from "../photo/photo.entity";

@Entity("routes")
export class RouteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @ManyToOne(() => Photo, { nullable: true, eager: true })
  cover: Photo | null;

  @OneToMany(() => PointEntity, (p) => p.route, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  points: PointEntity[];
}
