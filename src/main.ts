import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json, urlencoded } from "express";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { UrlHostInterceptor } from "./common/interceptors/url-host.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // увеличиваем лимиты тела запросов
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ limit: "50mb", extended: true }));

  app.setGlobalPrefix("api");
  app.useGlobalInterceptors(new UrlHostInterceptor());

  // статические файлы из uploads, кэш на 7 дней
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/api/uploads/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    etag: true,
    lastModified: true,
    setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=" + 7 * 24 * 60 * 60),
  });

  // CORS для всех доменов и методов
  app.enableCors({ origin: true, methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], credentials: true });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Travel Backend API")
    .setDescription("Документация эндпоинтов")
    .setVersion("1.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "access-token")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = parseInt(process.env.PORT, 10) || 3002;
  await app.listen(port, "0.0.0.0");
  console.log(`🚀 Server ready at http://localhost:${port}/api`);
}

bootstrap();
