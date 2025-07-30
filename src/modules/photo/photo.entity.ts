import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { PointEntity } from "../point/point.entity";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column()
  originalUrl: string;

  @Column()
  webpUrl: string;

  @Column()
  previewUrl: string;

  @ManyToOne(() => PointEntity, (pt) => pt.photos, { onDelete: "CASCADE" })
  point: PointEntity;
}
