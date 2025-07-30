import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PointEntity } from "./point.entity";

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointEntity)
    private readonly pointRepository: Repository<PointEntity>
  ) {}

  async findOne(id: string): Promise<PointEntity> {
    return this.pointRepository.findOne({ where: { id } });
  }
}
