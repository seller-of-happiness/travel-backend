// photos.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Req,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { Request } from "express";
import { PhotosService } from "./photos.service";

@Controller("photos")
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor("file", 20, {
      // Сохраняем загруженные файлы в папку uploads/photos
      storage: diskStorage({
        destination: "./uploads/photos",
        filename: (_, file, cb) => {
          // Генерируем уникальное имя файла
          const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      // Лимит на размер каждого файла
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        // Разрешаем только изображения
        if (!file.mimetype.startsWith("image/")) {
          return cb(
            new BadRequestException("Only image files are allowed!"),
            false
          );
        }
        cb(null, true);
      },
    })
  )
  async uploadPhotos(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request
  ) {
    // Проверяем, что файлы действительно пришли
    if (!files || files.length === 0) {
      throw new BadRequestException("No images provided");
    }

    // Обрабатываем каждое фото: ресайз, webp, сохраняем в БД
    const saved = await Promise.all(
      files.map(async (f) => {
        // 1) Обрабатываем файл: создаём preview и webp-версию
        const photoPaths = await this.photosService.processImage(f.path);

        // 2) Сохраняем запись в БД с путями
        const created = await this.photosService.create({
          url: photoPaths.originalUrl,
          originalUrl: photoPaths.originalUrl,
          webpUrl: photoPaths.webpUrl,
          previewUrl: photoPaths.previewUrl,
        });

        // 3) Возвращаем фронту нужные поля
        return {
          id: created.id,
          originalUrl: created.originalUrl,
          webpUrl: created.webpUrl,
          previewUrl: created.previewUrl,
        };
      })
    );

    // Если один файл — возвращаем объект, иначе массив
    return files.length === 1 ? saved[0] : saved;
  }
}
