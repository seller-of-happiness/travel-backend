import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { RouteEntity } from "../route/route.entity";
import { Photo } from "../photo/photo.entity";

@Entity("points")
export class PointEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("float")
  lat: number;

  @Column("float")
  lng: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @OneToMany(() => Photo, (photo) => photo.point, {
    cascade: true,
    eager: true,
  })
  photos: Photo[];

  @ManyToOne(() => RouteEntity, (route) => route.points, {
    onDelete: "CASCADE",
  })
  route: RouteEntity;
}
