import { Controller, Get, Param } from "@nestjs/common";
import { PointsService } from "./points.service";
import { PointEntity } from "./point.entity";

@Controller("points")
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get(":id")
  async getPoint(@Param("id") id: string): Promise<PointEntity> {
    return this.pointsService.findOne(id);
  }
}
