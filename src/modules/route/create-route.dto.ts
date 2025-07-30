export class CreateRouteDto {
  title: string;
  description?: string;
  cover: { id: string } | null;
  points: {
    lat: number;
    lng: number;
    description?: string;
    photos: { id: string }[];
  }[];
}
