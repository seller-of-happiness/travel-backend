import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RouteEntity } from "./route.entity";
import { PointEntity } from "../point/point.entity";
import { Photo } from "../photo/photo.entity";
import { RoutesService } from "./routes.service";
import { RoutesController } from "./routes.controller";
import { PhotosController } from "../photo/photos.controller";
import { PhotosService } from "../photo/photos.service";

@Module({
  imports: [TypeOrmModule.forFeature([RouteEntity, PointEntity, Photo])],
  controllers: [RoutesController, PhotosController],
  providers: [RoutesService, PhotosService],
  exports: [RoutesService, PhotosService],
})
export class RoutesModule {}
