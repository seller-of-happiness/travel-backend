import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate as isUUID } from "uuid";
import { RouteEntity } from "./route.entity";
import { PointEntity } from "../point/point.entity";
import { Photo } from "../photo/photo.entity";
import { CreateRouteDto } from "../../dtos/create-route.dto";
import { ReadRouteDto } from '../../dtos/read-route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepo: Repository<RouteEntity>,
    @InjectRepository(PointEntity)
    private readonly pointRepo: Repository<PointEntity>,
    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>
  ) {}

  /** Создаёт новый маршрут с обложкой и точками */
  async create(dto: CreateRouteDto): Promise<RouteEntity> {
    let coverPhoto: Photo | undefined;

    // 1) Обработка обложки: по UUID или по имени файла
    if (dto.cover?.id) {
      const raw = dto.cover.id;
      coverPhoto = isUUID(raw)
        ? await this.photoRepo.findOne({ where: { id: raw } })
        : await this.photoRepo.findOne({
            where: { url: `/uploads/photos/${raw}` },
          });
    }

    // 2) Формируем точки маршрута и привязываем фотографии
    const points: PointEntity[] = [];
    for (const p of dto.points ?? []) {
      const pt = this.pointRepo.create({
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        description: p.description,
      });

      pt.photos = [];
      for (const ph of p.photos ?? []) {
        let photoObj: Photo | null = null;
        if (typeof ph === "object" && ph.id) {
          const rawId = ph.id;
          photoObj = isUUID(rawId)
            ? await this.photoRepo.findOne({ where: { id: rawId } })
            : await this.photoRepo.findOne({
                where: { url: `/uploads/photos/${rawId}` },
              });
        }
        if (photoObj) pt.photos.push(photoObj);
      }

      points.push(pt);
    }

    // 3) Сохраняем маршрут вместе с точками и обложкой
    const route = this.routeRepo.create({
      title: dto.title,
      description: dto.description,
      cover: coverPhoto,
      points,
    });
    return this.routeRepo.save(route);
  }

  /** Обновляет существующий маршрут целиком */
  async update(id: string, dto: CreateRouteDto): Promise<RouteEntity> {
    const route = await this.routeRepo.findOne({
      where: { id },
      relations: ["points", "points.photos"],
    });
    if (!route) throw new NotFoundException("Route not found");

    // Обновляем базовые поля
    route.title = dto.title;
    route.description = dto.description;

    // Обновляем или сбрасываем обложку
    if (dto.cover?.id) {
      const raw = dto.cover.id;
      route.cover = isUUID(raw)
        ? await this.photoRepo.findOne({ where: { id: raw } })
        : await this.photoRepo.findOne({
            where: { url: `/uploads/photos/${raw}` },
          });
    } else {
      route.cover = null;
    }

    // Полностью перезаписываем точки
    route.points = [];
    for (const p of dto.points ?? []) {
      const pt = new PointEntity();
      pt.lat = p.lat;
      pt.lng = p.lng;
      pt.name = p.name;
      pt.description = p.description;
      pt.photos = [];

      for (const ph of p.photos ?? []) {
        let photoObj: Photo | null = null;
        if (typeof ph === "object" && ph.id) {
          const pid = ph.id;
          photoObj = isUUID(pid)
            ? await this.photoRepo.findOne({ where: { id: pid } })
            : await this.photoRepo.findOne({
                where: { url: `/uploads/photos/${pid}` },
              });
        }
        if (photoObj) pt.photos.push(photoObj);
      }
      route.points.push(pt);
    }

    await this.routeRepo.save(route);

    // Возвращаем обновлённую сущность с точками и фото
    const updated = await this.routeRepo.findOne({
      where: { id },
      relations: ["points", "points.photos"],
    });
    if (!updated) throw new NotFoundException("Route not found after update");
    return updated;
  }

  /** Получить все маршруты вместе с точками и фото */
  async findAll(): Promise<ReadRouteDto[]> {
    const routes = await this.routeRepo.find({
      relations: [
        'cover',
        'points',
        'points.photos',
      ],
    });

    if (routes.length === 0) {
      return [];
    }

    return routes.map((route, i, arr) => {
      const prevId = i > 0 ? arr[i - 1].id : null;
      const nextId = i < arr.length - 1 ? arr[i + 1].id : null;
      return new ReadRouteDto(route, prevId, nextId);
    });
  }

  /** Получить один маршрут по ID */
  async findOne(id: string): Promise<ReadRouteDto> {
    const routes = await this.findAll();
    const dto = routes.find(r => r.id === id);
    if (!dto) {
      throw new NotFoundException('Route not found');
    }
    return dto;
  }

  /** Удалить маршрут по ID */
  async delete(id: string): Promise<void> {
    const result = await this.routeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Route not found");
    }
  }
}
