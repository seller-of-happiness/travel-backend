# Travel Backend API

Backend API для туристического приложения, построенный на NestJS с TypeORM и PostgreSQL.

## Описание

Travel Backend - это REST API сервис для управления туристическими маршрутами, точками интереса и фотографиями. Приложение позволяет создавать, редактировать и получать информацию о маршрутах с привязкой к географическим координатам и медиа-контенту.

## Технологии

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer + Sharp (для обработки изображений)
- **Language**: TypeScript

## Основные возможности

- 🗺️ Управление туристическими маршрутами
- 📍 Создание точек интереса с координатами
- 📸 Загрузка и обработка фотографий (создание превью и WebP версий)
- 🔍 REST API с полной документацией
- 🚀 Готовая к продакшену архитектура

## Структура проекта

```
src/
├── main.ts                 # Точка входа приложения
├── app.module.ts          # Главный модуль приложения
├── common/
│   └── interceptors/      # Перехватчики запросов
├── modules/
│   ├── route/            # Модуль маршрутов
│   │   ├── route.entity.ts
│   │   ├── routes.controller.ts
│   │   ├── routes.service.ts
│   │   └── route.module.ts
│   ├── point/            # Модуль точек интереса
│   │   ├── point.entity.ts
│   │   ├── points.controller.ts
│   │   └── points.service.ts
│   └── photo/            # Модуль фотографий
│       ├── photo.entity.ts
│       ├── photos.controller.ts
│       └── photos.service.ts
```

## Модели данных

### Route (Маршрут)

- `id` - уникальный идентификатор
- `title` - название маршрута
- `description` - описание маршрута
- `cover` - обложка маршрута (фото)
- `points` - точки интереса в маршруте

### Point (Точка интереса)

- `id` - уникальный идентификатор
- `lat` - широта
- `lng` - долгота
- `description` - описание точки
- `photos` - фотографии точки
- `route` - принадлежность к маршруту

### Photo (Фотография)

- `id` - уникальный идентификатор
- `url` - URL изображения
- `originalUrl` - URL оригинального изображения
- `webpUrl` - URL WebP версии
- `previewUrl` - URL превью
- `point` - принадлежность к точке интереса

## Установка и запуск

### Предварительные требования

- Node.js 18+
- PostgreSQL 12+
- npm или yarn

### Установка зависимостей

```bash
npm install
```

### Настройка базы данных

1. Создайте базу данных PostgreSQL:

```sql
CREATE DATABASE travel;
```

2. Настройте переменные окружения (создайте файл `.env`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=travel
PORT=3002
```

### Запуск приложения

**Режим разработки:**

```bash
npm run start:dev
```

**Продакшен сборка:**

```bash
npm run build
npm start
```

## API Документация

После запуска приложения документация Swagger доступна по адресу:

```
http://localhost:3002/api/docs
```

### Основные эндпоинты

- `GET /api/routes` - получить все маршруты
- `POST /api/routes` - создать новый маршрут
- `GET /api/routes/:id` - получить маршрут по ID
- `PUT /api/routes/:id` - обновить маршрут
- `DELETE /api/routes/:id` - удалить маршрут

- `GET /api/points` - получить все точки интереса
- `POST /api/points` - создать новую точку
- `GET /api/points/:id` - получить точку по ID
- `PUT /api/points/:id` - обновить точку
- `DELETE /api/points/:id` - удалить точку

- `POST /api/photos/upload` - загрузить фотографию
- `GET /api/photos/:id` - получить фотографию по ID
- `DELETE /api/photos/:id` - удалить фотографию

## Лицензия

MIT License
