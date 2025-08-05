export class CreateRouteDto {
  title: string;
  description?: string;
  cover: { id: string } | null;
  points: {
    lat: number;
    lng: number;
    name: string;
    description?: string;
    photos: { id: string }[];
  }[];
}
