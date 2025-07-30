import { Injectable } from "@nestjs/common";
import * as sharp from "sharp";
import * as path from "path";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Photo } from "./photo.entity";

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepo: Repository<Photo>
  ) {}

  /** Сохраняем запись о фото в БД */
  async create(photo: Partial<Photo>) {
    const entity = this.photosRepo.create(photo);
    return this.photosRepo.save(entity);
  }

  /**
   * Обрабатываем загруженный файл:
   * - генерируем превью в webp (400px)
   * - конвертим в webp (если нужно)
   * - возвращаем относительные пути
   */
  async processImage(filePath: string): Promise<{
    previewUrl: string;
    webpUrl: string;
    originalUrl: string;
  }> {
    // расширение и базовое имя
    const ext = path.extname(filePath).toLowerCase();
    const base = filePath.slice(0, -ext.length);

    // создаём превью 400px в webp
    const previewPath = `${base}_preview.webp`;
    await sharp(filePath).resize(400).webp({ quality: 80 }).toFile(previewPath);

    // конвертация оригинала в webp (если это не .webp)
    let webpPath: string;
    if (ext !== ".webp") {
      webpPath = `${base}.webp`;
      await sharp(filePath).webp({ quality: 90 }).toFile(webpPath);
    } else {
      webpPath = filePath;
    }

    // приводим к относительному URL
    const cwd = process.cwd();
    const toRel = (p: string) => p.replace(cwd, "").replace(/\\/g, "/");

    return {
      previewUrl: toRel(previewPath),
      webpUrl: toRel(webpPath),
      originalUrl: toRel(filePath),
    };
  }
}
