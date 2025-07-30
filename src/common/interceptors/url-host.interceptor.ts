import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import type { Request } from "express";

@Injectable()
export class UrlHostInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Получаем запрос и формируем базовый URL
    const req = context.switchToHttp().getRequest<Request>();
    const host = `${req.protocol}://${req.get("host")}`;

    // После выполнения контроллера добавляем хост к URL в ответе
    return next.handle().pipe(map((data) => this.addHost(data, host)));
  }

  private addHost(data: any, host: string): any {
    if (Array.isArray(data)) {
      // Обрабатываем массивы рекурсивно
      return data.map((item) => this.addHost(item, host));
    }
    if (data && typeof data === "object") {
      const out: any = {};
      // Копируем все поля, углубляясь в объекты
      for (const key of Object.keys(data)) {
        out[key] = this.addHost(data[key], host);
      }
      // Подставляем хост перед путями к файлам
      if (out.originalUrl) out.originalUrl = `${host}/api/${out.originalUrl}`;
      if (out.previewUrl)  out.previewUrl  = `${host}/api/${out.previewUrl}`;
      if (out.webpUrl)     out.webpUrl     = `${host}/api/${out.webpUrl}`;
      return out;
    }
    // Для всех прочих типов возвращаем как есть
    return data;
  }
}
