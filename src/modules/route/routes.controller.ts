import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { RoutesService } from "./routes.service";
import { CreateRouteDto } from "./create-route.dto";

@Controller("routes")
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  create(@Body() dto: CreateRouteDto) {
    return this.routesService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: CreateRouteDto) {
    return this.routesService.update(id, dto);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.routesService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.routesService.delete(id);
  }
}
