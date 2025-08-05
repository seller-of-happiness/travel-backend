// src/modules/route/dto/read-route.dto.ts
import { RouteEntity } from '../modules/route/route.entity';

export class ReadRouteDto {
  id: string;
  title: string;
  description?: string;
  cover: {
    id: string; url: string; webpUrl: string;
    previewUrl: string; } | null;
  points: {
    id: string;
    lat: number;
    lng: number;
    name: string;
    description?: string;
    photos: { id: string; url: string }[];
  }[];
  prevRouteId: string | null;
  nextRouteId: string | null;

  constructor(
    route: RouteEntity,
    prevId: string | null,
    nextId: string | null,
  ) {
    this.id          = route.id;
    this.title       = route.title;
    this.description = route.description;

    // теперь захватываем и url обложки
    this.cover = route.cover
      ? { id: route.cover.id, url: route.cover.url, webpUrl: route.cover.webpUrl, previewUrl: route.cover.previewUrl }
      : null;

    this.points = route.points.map(p => ({
      id:          p.id,
      lat:         p.lat,
      lng:         p.lng,
      name:        p.name,
      description: p.description,
      // и здесь – url каждой фотографии
      photos: p.photos.map(ph => ({
        id:  ph.id,
        url: ph.url,
        webpUrl: ph.webpUrl,
        previewUrl: ph.previewUrl,
      })),
    }));

    this.prevRouteId = prevId;
    this.nextRouteId = nextId;
  }
}