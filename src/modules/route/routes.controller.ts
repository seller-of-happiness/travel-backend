// src/modules/route/routes.controller.ts
import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from '../../dtos/create-route.dto';
import { ReadRouteDto } from '../../dtos/read-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  findAll(): Promise<ReadRouteDto[]> {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadRouteDto> {
    return this.routesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRouteDto) {
    return this.routesService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.delete(id);
  }
}
